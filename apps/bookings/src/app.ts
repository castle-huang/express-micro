//vercel
import express, {Request, Response} from 'express';
import {HttpTransport, importAllServices} from "@sojo-micro/rpc";

interface UserService {
    getUser(): Promise<any>;
}

async function startServer() {
    await importAllServices();
    const server = new HttpTransport("http://localhost:3000");
    const port = parseInt(process.env.PORT || '3003');
    await server.start(port, ['src', 'apps/bookings/src']);
    // 获取服务注册表
    const serviceRegistry = server.getServiceRegistry();

    if (serviceRegistry) {
        // 获取特定服务的代理
        for (let i = 0; i < 10; i++) {
            try {
                // 假设有一个 UserService 服务
                const userService: UserService = serviceRegistry.getService('demo_user-api');
                // 调用服务方法（通过代理自动负载均衡）
                const result = await userService.getUser();
                console.log('User info:', result);
            } catch (error) {
                console.error('Service call failed:', error);
            }
        }

    }
}

startServer().catch(console.error);
console.log('Server started');

