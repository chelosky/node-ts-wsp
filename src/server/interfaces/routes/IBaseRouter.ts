import { IMiddleware } from "koa-router";

export interface IBaseRouter {
    getRoutes: () => IMiddleware;
}
