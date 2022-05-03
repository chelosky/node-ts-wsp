import { IHealthService } from "../interfaces";

export class HealthService implements IHealthService {
    public getLiveness(): string{
        return 'HEALTH OK';
    }

    public getReadiness(): string{
        return 'HEALTH OK';
    }
}
