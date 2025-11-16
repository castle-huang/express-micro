import path from 'path';
import fs from 'fs';
import glob from 'glob';
import {container} from '../di/Container';

/**
 * Interface representing a scanned service with its metadata
 */
export interface ScannedService {
    name: string;
    instance: any;
    methods: any[];
    type: 'rpc' | 'controller' | 'service' | 'component';
}

/**
 * ServiceScanner scans directories for services, controllers, and components
 * and registers them with the dependency injection container
 *
 * Features:
 * - Recursive directory scanning for TypeScript files
 * - Automatic service type detection (RPC, Controller, Service, Component)
 * - Metadata extraction and service registration
 * - Method discovery and categorization
 */
export class ServiceScanner {
    private services: Map<string, ScannedService> = new Map();

    /**
     * Scans specified directories for services and registers them
     * @param directories - Array of directory paths to scan (default: ['src'])
     * @returns Promise resolving to array of scanned services
     */
    async scanServices(directories: string[] = ['src']): Promise<ScannedService[]> {
        const projectRoot = process.cwd();
        let allFiles = [];
        for (const dir of directories) {
            // Check if directory exists
            if (!fs.existsSync(dir)) {
                console.warn(`Directory does not exist: ${dir}`);
                continue;
            }

            const files = glob.sync(`${dir}/**/*.{ts,js}`, {
                ignore: ['**/*.test.{ts,js}', '**/*.spec.{ts,js}', '**/*.d.ts', '**/app.{ts,js}']
            });
            allFiles.push(...files);
        }
        const allClassMap: Map<string, any> = new Map()
        for (const file of allFiles) {
            const classMap = await this.scanFileClass(`${projectRoot}/${file}`);
            for (const [exportName, ExportClass] of classMap) {
                allClassMap.set(exportName, ExportClass)
            }
        }
        return await this.scanService(allClassMap);
    }


    private async scanFileClass(filePath: string): Promise<Map<string, any>> {
        const classMap: Map<string, any> = new Map()

        try {
            delete require.cache[require.resolve(filePath)];
            const module = require(filePath);
            for (const [exportName, ExportClass] of Object.entries(module)) {
                if (typeof ExportClass === 'function') {
                    container.registerAllClass(ExportClass)
                    classMap.set(exportName, ExportClass)
                }
            }
        } catch (error) {
            console.error(`Failed to scan file class ${filePath}:`, error);
            throw error;
        }
        return classMap;
    }

    private async scanService(classMap: Map<string, any>): Promise<ScannedService[]> {
        const services: ScannedService[] = [];
        for (const [exportName, ExportClass] of classMap) {
            if (typeof ExportClass === 'function') {
                const serviceType = this.getServiceType(ExportClass);
                if (serviceType) {
                    const service = await this.registerService(ExportClass, exportName, serviceType);
                    if (service) {
                        services.push(service);
                        this.services.set(service.name, service);
                    }
                }
            }
        }
        return services;
    }

    /**
     * Determines the type of service based on metadata
     * @param Class - Class constructor to check
     * @returns Service type or null if not a service
     */
    private getServiceType(Class: any):
        'rpc' | 'controller' | 'service' | 'component' | null {
        // Check for RPC service
        if (Reflect.hasMetadata('rpc:service', Class)) {
            return 'rpc';
        }

        // Check for controller
        if (Reflect.hasMetadata('controller:metadata', Class)) {
            return 'controller';
        }

        // Check for regular service/component
        if (container.has(Class)) {
            // Further type discrimination simplified here
            return 'service';
        }

        return null;
    }

    /**
     * Registers a service with the container and collects its metadata
     * @param ServiceClass - Service class to register
     * @param exportName - Name of the exported class
     * @param serviceType - Type of service being registered
     * @returns Promise resolving to scanned service metadata or null
     */
    private async registerService(ServiceClass: any, exportName: string, serviceType: 'rpc' | 'controller' | 'service' | 'component'):
        Promise<ScannedService | null> {
        try {
            let serviceName: string;
            let methodMetadata: any[] = [];
            switch (serviceType) {
                case 'rpc':
                    const serviceMetadata = Reflect.getMetadata('rpc:service', ServiceClass);
                    methodMetadata = Reflect.getMetadata('rpc:methods', ServiceClass) || [];
                    serviceName = serviceMetadata.name;
                    break;
                case 'controller':
                    const controllerMetadata = Reflect.getMetadata('controller:metadata', ServiceClass);
                    methodMetadata = Reflect.getMetadata('controller:routes', ServiceClass) || [];
                    serviceName = controllerMetadata.name;
                    break;
                default:
                    serviceName = ServiceClass.name;
                    // For regular services, collect public methods
                    methodMetadata = this.extractPublicMethods(ServiceClass);
            }
            // Use DI container to resolve instance
            const instance = container.resolve(serviceName);
            return {
                name: serviceName,
                instance,
                methods: methodMetadata,
                type: serviceType
            };
        } catch (error) {
            console.error(`Failed to register service ${exportName}:`, error);
            throw error;
        }
    }

    /**
     * Extracts public methods from a service class prototype chain
     * @param ServiceClass - Class to extract methods from
     * @returns Array of method metadata objects
     */
    private extractPublicMethods(ServiceClass: any): any[] {
        const methods: any[] = [];
        let proto = ServiceClass.prototype;

        while (proto && proto !== Object.prototype) {
            const propNames = Object.getOwnPropertyNames(proto);
            for (const name of propNames) {
                if (name !== 'constructor' && typeof proto[name] === 'function') {
                    methods.push({
                        name: name,
                        originalName: name
                    });
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        return methods;
    }

    /**
     * Retrieves a scanned service by name
     * @param name - Name of the service to retrieve
     * @returns Scanned service or undefined if not found
     */
    getService(name: string):
        ScannedService | undefined {
        return this.services.get(name);
    }

    /**
     * Retrieves all scanned services
     * @returns Array of all scanned services
     */
    getAllServices(): ScannedService[] {
        return Array.from(this.services.values());
    }

    /**
     * Retrieves all RPC services
     * @returns Array of RPC services
     */
    getRpcServices(): ScannedService[] {
        return Array.from(this.services.values()).filter(service => service.type === 'rpc');
    }

    /**
     * Retrieves all controllers
     * @returns Array of controller services
     */
    getControllers(): ScannedService[] {
        return Array.from(this.services.values()).filter(service => service.type === 'controller');
    }

    /**
     * Retrieves a specific method from a service
     * @param serviceName - Name of the service
     * @param methodName - Name of the method to find
     * @returns Method metadata or undefined if not found
     */
    getMethod(serviceName: string, methodName: string):
        any {
        const service = this.services.get(serviceName);
        if (!service) return undefined;

        return service.methods.find(m => m.name === methodName || m.originalName === methodName);
    }
}