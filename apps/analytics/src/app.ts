//vercel
import express, {Request, Response} from 'express';
import {HttpTransport, importAllServices} from "@sojo-micro/rpc";

async function startServer() {
    await importAllServices();
    const server = new HttpTransport("http://localhost:3000");
    const port = parseInt(process.env.PORT || '3005');
    await server.start(port, ['src', 'apps/analytics/src']);
}

startServer().catch(console.error);
console.log('Server started');

