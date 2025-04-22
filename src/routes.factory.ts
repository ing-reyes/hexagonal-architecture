import { Router } from "express";
import { AuthRoutes } from "./modules/auth/infraestructure/adapters/drivers/http";
import { UserRoutes } from "./modules/user/infraestructure/adapters/drivers/http";

export class RoutesFactory {
    constructor(
        private readonly userRoutes: UserRoutes,
        private readonly authRoutes: AuthRoutes,
    ) { }
    get routes(): Router {
        const router = Router();

        router.use('/api/users', this.userRoutes.routes);
        router.use('/api/auth', this.authRoutes.routes);

        return router;
    }
}