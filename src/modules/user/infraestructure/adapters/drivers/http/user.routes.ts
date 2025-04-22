import { Router } from "express";
import { UserMiddleware } from "./middlewares";
import { PaginationMiddleware, ValidateIdMiddleware } from "../../../../../../shared/middlewares";
import { UserController } from "./user.controller";

export class UserRoutes {
    constructor(
        private readonly userController: UserController,
        private readonly userMiddleware: UserMiddleware,
        private readonly paginationMiddleware: PaginationMiddleware,
        private readonly validateIdMiddleware: ValidateIdMiddleware,
    ) { }
    get routes(): Router {
        const router = Router();

        router.post('/', [
            this.userMiddleware.createUser
        ],
            this.userController.create,
        );
        router.get('/', [
            this.paginationMiddleware.validatePagination,
        ],
            this.userController.findAll);
        router.get('/:id', [
            this.validateIdMiddleware.isMongoId
        ],
            this.userController.findOneById);
        router.patch('/:id', [
            this.validateIdMiddleware.isMongoId,
            this.userMiddleware.updateUser
        ], this.userController.update);
        router.delete('/:id', [
            this.validateIdMiddleware.isMongoId,
        ], this.userController.remove);

        return router;
    }
}