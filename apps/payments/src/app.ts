//vercel
import express, {Request, Response} from 'express';
import {HttpTransport, importAllServices} from "@sojo-micro/rpc";

async function startServer() {
    await importAllServices();
    const server = new HttpTransport();
    const port = parseInt(process.env.PORT || '3004');
    await server.start(port, ['src', 'apps/auth/src']);
}

startServer().catch(console.error);
console.log('Server started');

