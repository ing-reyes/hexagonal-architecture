import { NextFunction, Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "../validators";

export class UserMiddleware {
    createUser = (req: Request, res: Response, next: NextFunction) => {
        try {
            const createUser = createUserSchema.safeParse(req.body);
            if (!createUser.success) {
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: createUser.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });

                return;
            }

            req.body.createUser = createUser.data;
            next();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    updateUser = (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateUser = updateUserSchema.safeParse(req.body);
            if (!updateUser.success) {
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: updateUser.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });

                return;
            }

            req.body.updateUser = updateUser.data;
            next();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}