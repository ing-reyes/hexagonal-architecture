import { Request, Response } from "express";
import { UserServicePort } from "../../../../../domain/ports/primary";
import { Handler } from "../../../../../common/errors";

export class UserController{
    constructor(
        private readonly userService: UserServicePort,
        private readonly handler: Handler,
    ){}
    create = (req: Request, res: Response) => {
        this.userService.create(req.body.createUser)
        .then((user)=>res.json(user))
        .catch((error)=>this.handler.error(error, res));
    }
    findAll = (req: Request, res: Response)=> {
        this.userService.findAll(req.body.pagination)
        .then((user)=>res.json(user))
        .catch((error)=>this.handler.error(error, res));
    }
    findOneById = (req: Request, res: Response)=> {
        this.userService.findOneById(req.params.id)
        .then((user)=>res.json(user))
        .catch((error)=>this.handler.error(error, res));
    }
    update = (req: Request, res: Response) => {
        this.userService.update(req.params.id, req.body.updateUser)
        .then((user)=>res.json(user))
        .catch((error)=>this.handler.error(error, res));
    }
    remove = (req: Request, res: Response)=> {
        this.userService.remove(req.params.id)
        .then((user)=>res.json(user))
        .catch((error)=>this.handler.error(error, res));
    }
}