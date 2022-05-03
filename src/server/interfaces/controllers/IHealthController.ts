import { ParameterizedContext } from "koa";

export interface IHealthController {
    getLiveness: (ctx: ParameterizedContext) => void;
    getReadiness: (ctx: ParameterizedContext) => void;
}
