import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import registryRoutes from './routes/Registry';

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 路由
app.use('/api/registry', registryRoutes);

// 根路由
app.get('/', (req, res) => {
    res.json({
        message: 'Service Registry Center is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            register: 'POST /api/registry/register',
            unregister: 'DELETE /api/registry/unregister/:serviceId',
            heartbeat: 'POST /api/registry/heartbeat/:serviceId',
            discover: 'POST /api/registry/discover',
            services: 'GET /api/registry/services',
            health: 'GET /api/registry/health'
        }
    });
});

// 全局错误处理
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

export default app;