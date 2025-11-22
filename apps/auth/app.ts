import dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import path from "path";
import fs from "fs";
import {register} from 'tsconfig-paths';

dotenv.config();

const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');
register({
    baseUrl: path.dirname(tsConfigPath),
    paths: {
        "@/*": ["./src/*"]
    }
});
const app = express()

// Health check endpoint
app.get('/health1', (req: Request, res: Response) => {
    const cwd = process.cwd();
    const fs = require('fs');
    const path = require('path');

    // 递归获取目录下所有文件
    function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
        const files = fs.readdirSync(dirPath);

        files.forEach((file: string) => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            } else {
                arrayOfFiles.push(filePath);
            }
        });

        return arrayOfFiles;
    }

    const allFiles = getAllFiles(cwd);

    res.json({
        status: 'healthy',
        tsConfigPath: tsConfigPath,
        baseUrl: path.dirname(tsConfigPath),
        timestamp: new Date().toISOString(),
        cwd,
        files: allFiles
    });
});
const server = new HttpTransport(app);

//vercel 扫包问题
async function importAllServices() {
    try {
        const serviceDir = path.join(__dirname, './src');
        const files = fs.readdirSync(serviceDir);
        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
            }
        }
    } catch (error) {
    }
}

async function startServer() {
    await importAllServices()
    await server.scanServices(["src", "apps/auth/src"])
    const port = parseInt(process.env.PORT || '3000');
    await server.start(port);
}

startServer()
    .then(() => {
        console.log('Server started successfully');
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
    });
export default app;

