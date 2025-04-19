import { Response } from "express";
import { ManagerError } from "./manager.error";

export class Handler {
    error(error: unknown, res: Response) {
        if (error instanceof ManagerError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, statusMsg: error.statusMsg, error: error.message });
            return;
        }

        if (error instanceof Error) {
            res.status(500).json({ statusCode: 500, statusMsg: 'INTERNAL_SERVER_ERROR', error: error.message });
        }
    }
}