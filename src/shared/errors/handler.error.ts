import { Response } from "express";
import { ManagerError } from "./manager.error";
import { HttpStatus } from "../enums";

export class Handler {
    error(error: unknown, res: Response) {
        if (error instanceof ManagerError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, statusMsg: error.statusMsg, error: error.message });
            return;
        }

        if (error instanceof Error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, statusMsg: 'INTERNAL_SERVER_ERROR', error: error.message });
        }
    }
}