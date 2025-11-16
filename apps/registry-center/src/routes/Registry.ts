import {Router, Request, Response} from 'express';
import {RegistryService} from '../services/RegistryService';
import {ServiceRegistration, ServiceDiscovery} from '../models/Service';

const router = Router();
const registryService = new RegistryService();

// 服务注册
router.post('/register', (req: Request, res: Response) => {
    try {
        const registration: ServiceRegistration = req.body;

        // 验证必要字段
        if (!registration.name || !registration.address || !registration.port) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, address, port'
            });
        }

        const serviceInstance = registryService.register(registration);

        res.status(201).json({
            success: true,
            data: serviceInstance,
            message: 'Service registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 服务注销
router.delete('/unregister/:serviceId', (req: Request, res: Response) => {
    try {
        const {serviceId} = req.params;
        const success = registryService.unregister(serviceId);

        if (success) {
            res.json({
                success: true,
                message: 'Service unregistered successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
    } catch (error) {
        console.error('Unregistration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 心跳上报
router.post('/heartbeat/:serviceId', (req: Request, res: Response) => {
    try {
        const {serviceId} = req.params;
        const success = registryService.heartbeat(serviceId);

        if (success) {
            res.json({
                success: true,
                message: 'Heartbeat received'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
    } catch (error) {
        console.error('Heartbeat error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 服务发现
router.post('/discover', (req: Request, res: Response) => {
    try {
        const discovery: ServiceDiscovery = req.body;

        if (!discovery.name) {
            return res.status(400).json({
                success: false,
                message: 'Service name is required'
            });
        }

        const instances = registryService.discover(discovery);

        res.json({
            success: true,
            data: instances,
            count: instances.length
        });
    } catch (error) {
        console.error('Discovery error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 获取所有服务
router.get('/services', (req: Request, res: Response) => {
    try {
        const services = registryService.getAllServices();

        res.json({
            success: true,
            data: services,
            count: services.length
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 获取特定服务的所有实例
router.get('/services/:serviceName', (req: Request, res: Response) => {
    try {
        const {serviceName} = req.params;
        const instances = registryService.getServiceInstances(serviceName);

        res.json({
            success: true,
            data: instances,
            count: instances.length
        });
    } catch (error) {
        console.error('Get service instances error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 健康检查
router.get('/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
        serviceCount: registryService.getAllServices().length
    });
});

export default router;