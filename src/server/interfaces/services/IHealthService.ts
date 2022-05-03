export interface IHealthService {
    getLiveness: () => string;
    getReadiness: () => string;
}