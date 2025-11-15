export const routesConfig = {
    routers: [
        {
            name: 'analytics',
            prefix: '/api/analytics',
            target: 'analytics'
        },
        {
            name: 'auth',
            prefix: '/api/auth/',
            target: 'auth'
        },
        {
            name: 'booking',
            prefix: '/api/booking/',
            target: 'booking'
        },
        {
            name: 'business',
            prefix: '/api/business/',
            target: 'business'
        },
        {
            name: 'payments',
            prefix: '/api/payments',
            target: 'payments'
        },
        {
            name: 'report',
            prefix: '/api/report',
            target: 'report'
        }
    ]
};