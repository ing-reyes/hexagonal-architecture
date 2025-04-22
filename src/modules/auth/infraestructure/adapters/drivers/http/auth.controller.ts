import { Request, Response } from "express";
import { AuthServicePort } from "../../../../domain/ports/primary";
import { Handler } from "../../../../../../shared/errors";

export class AuthController {

    constructor(
        private readonly authService: AuthServicePort,
        private readonly handler: Handler,
    ) { }

    signIn = (req: Request, res: Response) => {
        this.authService.signIn(req.body.signIn)
            .then((auth) => res.json(auth))
            .catch((error) => this.handler.error(error, res))
    }

    signUp = (req: Request, res: Response) => {
        this.authService.signUp(req.body.signUp)
            .then((auth) => res.json(auth))
            .catch((error) => this.handler.error(error, res))
    }

    refreshToken = (req: Request, res: Response) => {
        this.authService.refreshToken(req.body.token)
            .then((auth) => res.json(auth))
            .catch((error) => this.handler.error(error, res))
    }

}