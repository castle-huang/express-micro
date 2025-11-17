import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import RouterManager from "./src/routers/router";

dotenv.config();

const app = express()
const server = new HttpTransport(app);

async function startServer() {
    const port = parseInt(process.env.PORT || '3000');
    new RouterManager(app);
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

