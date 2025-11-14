import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";

dotenv.config();

const app = express()
const server = new HttpTransport(app);

async function startServer() {
    await server.scanServices()
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

