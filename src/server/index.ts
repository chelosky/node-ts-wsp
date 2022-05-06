import Koa from 'koa';
import cors from '@koa/cors';
import { Server } from 'http';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import KoaLogger from 'koa-pino-logger';
import { AppRouter } from './routes';
import { ErrorHandler } from './middlewares';
import { IConfigParam } from '../config/interfaces';

export class AppServer {
    private app: Koa | undefined;
    private server: Server | undefined;

    constructor(private config: IConfigParam){
        this._setUp();
    }

    public start(): void{
        if (!this.app){
            throw new Error();
        }

        this.server = this.app.listen(this.config.port, () => {
            console.log(`Server in ${this.config.environment} - Started on port ${this.config.port}`);
        });
    }

    public close(): void{
        if (!this.server){
            throw new Error();
        }

        this.server.close();
        console.log('SERVER CLOSED');
    }

    private _setUp(): void{
        this.app = new Koa();
        const appRouter = new AppRouter();
        const router = appRouter.loadRoutes(new Router());
        const errorHandler = new ErrorHandler();

        this.app
            .use(errorHandler.handle)
            .use(cors())
            .use(bodyParser())
            .use(KoaLogger())
            .use(router.routes())
            .use(router.allowedMethods());
    }
}