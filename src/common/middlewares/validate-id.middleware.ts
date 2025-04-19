import { NextFunction, Request, Response } from "express";
import { mongoIdSchema } from "../../infraestructure/adapters/drivers/http/validators";

export class ValidateIdMiddleware {
    isMongoId = (req: Request, res: Response, next: NextFunction) => {

        try {
            const mongoId = mongoIdSchema.safeParse(req.params.id);

            if(!mongoId.success){
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: mongoId.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });

                return;
            }

            next();
        } catch (error) {
            console.error(error)
            throw error;
        }
    };
}