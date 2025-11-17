import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express()
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

