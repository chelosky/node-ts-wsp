import { ParameterizedContext } from "koa";
import { IHealthService } from "../interfaces";

export class HealthController{
    constructor(private service: IHealthService){
        this.service = service;
    }

    public getLiveness = (ctx: ParameterizedContext) => {
        ctx.body = this.service.getLiveness();
    }

    public getReadiness = (ctx: ParameterizedContext) => {
        ctx.body = this.service.getReadiness();
    }
}
