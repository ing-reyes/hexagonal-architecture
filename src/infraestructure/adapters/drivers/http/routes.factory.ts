import { Router } from "express";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";

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