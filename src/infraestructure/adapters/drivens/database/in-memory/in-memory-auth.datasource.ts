import { JwtConfig, VerifyToken } from "../../../../../common/config";
import { ManagerError } from "../../../../../common/errors";
import { AuthResponseDTO, AuthToken, SignInDTO, SignUpDTO, User, UserRole } from "../../../../../domain/entities";
import { HttpStatus } from "../../../../../domain/enums";
import { ApiOneResponse } from "../../../../../domain/interfaces";
import { AuthDatasourcePort } from "../../../../../domain/ports/secondary";
import { AuthMapper } from "../mongo/mappers";


export class InMemoryAuthDatasource implements AuthDatasourcePort {

    constructor(
        private readonly jwtConfig: JwtConfig,
    ) { }

    private readonly users: User[] = [
        { id: '1', name: 'name1', email: 'email1@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'name2', email: 'email2@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'name3', email: 'email3@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'name4', email: 'email4@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'name5', email: 'email5@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ]

    async signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        const { email, password } = signInDTO;
        try {
            const user = this.users.find((user) => user.email === email);
            if (!user) {
                throw ManagerError.badRequest('Credentials not valid!');
            }

            if (password !== user.password) {
                throw ManagerError.badRequest('Credentials not valid!');
            }
            const anHourInMilliseconds = 60 * 60 * 1000; // 60 seconds * 60 minutes * 1000 milliseconds
            const expiresIn = new Date().getTime() + anHourInMilliseconds;

            const accessToken = await this.jwtConfig.generateToken({ id: user.id, roles: user.roles }, anHourInMilliseconds);
            if (!accessToken) {
                throw ManagerError.internalServerError('Internal Server Error');
            }

            const tokens: AuthToken = {
                accessToken,
                expiresIn,
            }

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null
                },
                data: AuthMapper.modelUserToEntity({ user, tokens }),
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async signUp(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        try {

            const userExist = this.users.find((user) => user.email === signUpDTO.email);
            if (userExist) {
                throw ManagerError.conflict('Email not available')
            }

            const user: User = {
                ...signUpDTO,
                roles: [UserRole.USER],
                id: (this.users.length + 1).toString(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const accessToken = await this.jwtConfig.generateToken({ id: user.id, roles: user.roles });
            if (!accessToken) {
                throw ManagerError.internalServerError();
            }

            const tokens: AuthToken = {
                accessToken: accessToken,
                expiresIn: new Date().getTime()
            }

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null
                },
                data: AuthMapper.modelUserToEntity({ user, tokens }),
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async refreshToken(token: string): Promise<ApiOneResponse<AuthResponseDTO>> {
        try {

            const payload = await this.jwtConfig.verifyToken<VerifyToken>(token);
            if (!payload) {
                throw ManagerError.unauthorized('unauthorized');
            }

            const user = this.users.find((user) => user.id === payload.id);
            if (!user) {
                throw ManagerError.unauthorized('unauthorized');
            }

            const refreshToken = await this.jwtConfig.refresshToken(token);
            if (!refreshToken) {
                throw ManagerError.unauthorized('unauthorized');
            }

            const tokens: AuthToken = {
                accessToken: token,
                expiresIn: payload.exp,
                refreshToken
            }

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null
                },
                data: AuthMapper.modelUserToEntity({ user, tokens }),
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}