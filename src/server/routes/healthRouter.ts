import Router from "koa-router";
import { IHealthController } from "../interfaces";
import { IBaseRouter } from "../interfaces/routes";
import { EHealthEndpoint } from "./enum";

export class HealthRouter implements IBaseRouter {
    private router = new Router();
    
    constructor(private controller: IHealthController){
        this._setUp();
    }


    public getRoutes() {
        return this.router.routes();
    }

    private _setUp(){
        this.router.get(EHealthEndpoint.Liveness, this.controller.getLiveness);
        this.router.get(EHealthEndpoint.Readiness, this.controller.getReadiness);
    }
}