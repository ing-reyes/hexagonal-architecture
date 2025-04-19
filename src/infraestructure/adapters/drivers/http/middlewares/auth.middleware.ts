import { HttpStatus, UserRole } from "../../../../../domain/enums";
import { JwtConfig, VerifyToken } from "../../../../../common/config";
import { NextFunction, Request, Response } from "express";
import { signInSchema, signUpSchema } from "../validators";
import { UserDatasourcePort } from "../../../../../domain/ports/secondary";
import { UserMapper } from "../../../drivens/database/mongo/mappers";

export class AuthMiddleware {
    constructor(
        private readonly jwtConfig: JwtConfig,
        private readonly userDatasource: UserDatasourcePort,
    ) { }
    validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.header('Authorization');

        if (!authorization) {
            res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'Invalid token' });
            return;
        }
        if (!authorization.startsWith('Bearer ')) {
            res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'Invalid authorization header' });
            return;
        }

        try {
            const token = authorization.split(' ').at(1) ?? '';

            const payload = await this.jwtConfig.verifyToken<VerifyToken>(token);
            if (!payload) {
                res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'Invalid token' });
                return;
            }

            const user = await this.userDatasource.findOneById(payload.id)
            if (!user.data) {
                res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'User not found!' });
                return;
            }

            req['user'] = UserMapper.modelUserToEntity(user.data);

            next();
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, statusMsg: 'INTERNAL_SERVER_ERROR', error: 'Internal Server Error!' });
            return;
        }
    }

    validateRoles = (roles: UserRole[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = req['user'];
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'Unauthorized' });
                return;
            }

            const hasRole = roles.some(role => user.roles.includes(role));
            if (!hasRole) {
                res.status(403).json({ statusCode: HttpStatus.FORBIDDEN, statusMsg: 'FORBIDDEN', error: 'Forbiden!' });
                return;
            }

            next();
        }
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.header('Authorization');

        if (!authorization) {
            res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Missing authorization header' });
            return;
        }
        if (!authorization.startsWith('Bearer ')) {
            res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid authorization header' });
            return;
        }

        try {
            const token = authorization.split(' ').at(1) ?? '';

            const payload = await this.jwtConfig.verifyToken<{ id: string, roles: UserRole[] }>(token);
            if (!payload) {
                res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'Invalid token' });
                return;
            }

            const user = await this.userDatasource.findOneById(payload.id)
            if (!user.data) {
                res.status(HttpStatus.UNAUTHORIZED).json({ statusCode: HttpStatus.UNAUTHORIZED, statusMsg: 'UNAUTHORIZED', error: 'User not found!' });
                return;
            }

            req['user'] = UserMapper.modelUserToEntity(user.data);

            req.body.token = token;

            next();
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, statusMsg: 'INTERNAL_SERVER_ERROR', error: 'Internal Server Error!' });
            return;
        }
    }

    signIn = (req: Request, res: Response, next: NextFunction) => {
        try {
            const signIn = signInSchema.safeParse(req.body);
            if (!signIn.success) {
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: signIn.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });

                return;
            }

            req.body.signIn = signIn.data;
            next();
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    signUp = (req: Request, res: Response, next: NextFunction) => {
        try {
            const signUp = signUpSchema.safeParse(req.body);
            if (!signUp.success) {
                res.status(400).json({
                    statusCode: 400,
                    statusMsg: 'BAD_REQUEST',
                    error: signUp.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });

                return;
            }

            req.body.signUp = signUp.data;
            next();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}