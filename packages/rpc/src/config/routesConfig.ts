export const routesConfig = {
    routers: [
        {
            name: 'analytics',
            prefix: '/api/analytics',
            target: process.env.ANALYTICS_TARGET || 'http://localhost:3001'
        },
        {
            name: 'auth',
            prefix: '/api/auth/',
            target: process.env.AUTH_TARGET || 'http://localhost:3002'
        },
        {
            name: 'business',
            prefix: '/api/biz/',
            target: process.env.BUSINESS_TARGET || 'http://localhost:3004'
        },
        {
            name: 'payments',
            prefix: '/api/payments',
            target: process.env.PAYMENTS_TARGET || 'http://localhost:3005'
        },
        {
            name: 'report',
            prefix: '/api/report',
            target: process.env.REPORT_TARGET || 'http://localhost:3006'
        }
    ]
};