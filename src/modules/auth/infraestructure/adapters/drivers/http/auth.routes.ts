import { Router } from "express";

import { AuthMiddleware } from "./middlewares";
import { AuthController } from "./auth.controller";

export class AuthRoutes {
    constructor(
        private readonly authController: AuthController,
        private readonly authMiddleware: AuthMiddleware,
    ){}
    get routes(): Router{
        const router = Router();

        router.post('/sign-in',[ 
            this.authMiddleware.signIn
        ], 
            this.authController.signIn,
        );

        router.post('/sign-up',[ 
            this.authMiddleware.signUp
        ], 
            this.authController.signUp,
        );

        router.post('/refresh-token',[ 
            this.authMiddleware.validateJWT,
            this.authMiddleware.refreshToken
        ], 
            this.authController.refreshToken,
        );
        
        return router;
    }
}