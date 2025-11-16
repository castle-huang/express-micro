import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express()
const server = new HttpTransport(app);

async function startServer() {
    const serviceDir = path.join(__dirname, './');
    fs.readdirSync(serviceDir);
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

