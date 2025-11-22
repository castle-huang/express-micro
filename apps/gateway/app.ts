import dotenv from 'dotenv';
import express from 'express';
import {HttpTransport} from "@sojo-micro/rpc";
import RouterManager from "./src/routers/router";
import path from "path";
import {register} from "tsconfig-paths";

let tsConfigPath = process.cwd();
if (!tsConfigPath.includes("apps")) {
    tsConfigPath = path.resolve(tsConfigPath, 'apps/gateway');
}
tsConfigPath = path.resolve(tsConfigPath, 'tsconfig.json');
register({
    baseUrl: path.dirname(tsConfigPath),
    paths: {
        "@/*": ["./src/*"]
    }
});
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

