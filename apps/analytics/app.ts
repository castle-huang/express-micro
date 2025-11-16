import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express()
const server = new HttpTransport(app);

async function importAllServices(dir: string) {
    try {
        const serviceDir = path.join(__dirname, 'src');
        const files = fs.readdirSync(serviceDir);

        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                await import(path.join(serviceDir, file));
            }
        }
    } catch (error) {
        console.log(error);
    }

}

async function startServer() {
    await importAllServices(__dirname)
    console.log("__dirname==>" + __dirname)
    await server.scanServices(["src", "apps/analytics/src"])
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

