import { NextFunction, Request, Response } from "express";
import { paginationSchema } from "../validators";

export class PaginationMiddleware {
    validatePagination = (req: Request, res: Response, next: NextFunction) => {

        try {
            const pagination = paginationSchema.safeParse(req.query);
            req.body.pagination = pagination.data;

            if(!pagination.success){
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: pagination.error.issues.map(issue => ({
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