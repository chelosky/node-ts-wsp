import Router from "koa-router"
import { ExampleController } from "../controllers";
import { HealthController } from "../controllers/healthController";
import { HealthService } from "../services";
import { EEndpoint } from "./enum";
import { HealthRouter } from "./healthRouter";

export class AppRouter {
    public loadRoutes(router: Router): Router{
        const service = new HealthService();
        const healthCtrl = new HealthController(service);
        const healthRouter = new HealthRouter(healthCtrl);
        const exampleCtrl = new ExampleController();

        router.use(EEndpoint.Health, healthRouter.getRoutes());
        router.post(EEndpoint.Example, exampleCtrl.postExample);

        return router;
    }
}
