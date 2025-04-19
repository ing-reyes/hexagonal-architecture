import { ApiOneResponse } from "../../../../../../domain/interfaces";
import { AuthDatasourcePort } from "../../../../../../domain/ports/secondary";
import { AuthMapper } from "../mappers";
import { HttpStatus } from "../../../../../../domain/enums";
import { JwtConfig, VerifyToken, BcryptAdapter, envs } from "../../../../../../common/config";
import { ManagerError } from "../../../../../../common/errors";
import { SignInDTO, AuthResponseDTO, SignUpDTO, AuthToken } from "../../../../../../domain/entities";
import { UserModel } from "../models";

export class MongoAuthDatasource implements AuthDatasourcePort {

    constructor(
        private readonly jwtConfig: JwtConfig,
        private readonly bcryptAdapter: BcryptAdapter,
    ) { }

    async signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        const { email, password } = signInDTO;
        try {
            const user = await UserModel.findOne({ email, isActive: true })
            if (!user) {
                throw ManagerError.badRequest('Credentials not valid!');
            }

            const isMatch = await this.bcryptAdapter.compare(password, user.password);

            if (!isMatch) {
                throw ManagerError.badRequest('Credentials not valid!');
            }

            const expirationTime = envs.JWT_EXPIRES_IN;

            const accessToken = await this.jwtConfig.generateToken({ id: user.id, roles: user.roles }, expirationTime);
            if (!accessToken) {
                throw ManagerError.internalServerError('Internal Server Error');
            }

            const payload = await this.jwtConfig.verifyToken<VerifyToken>(accessToken);
            if (!payload) {
                throw ManagerError.internalServerError('Internal Server Error');
            }
            const tokens: AuthToken = {
                accessToken,
                expiresIn: payload.exp,
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
        const { email } = signUpDTO;
        try {

            const userExist = await UserModel.findOne({email})
            if (userExist) {
                throw ManagerError.conflict('Email not available')
            }

            const user = await UserModel.create({
                ...signUpDTO,
                password: await this.bcryptAdapter.hash(signUpDTO.password),
            });
            if(!user){
                throw ManagerError.conflict('User not created');
            }

            await user.save();

            const expirationTime = envs.JWT_EXPIRES_IN;

            const accessToken = await this.jwtConfig.generateToken({ id: user.id, roles: user.roles }, expirationTime);
            if (!accessToken) {
                throw ManagerError.internalServerError('Internal Server Error');
            }

            const payload = await this.jwtConfig.verifyToken<VerifyToken>(accessToken);
            if (!payload) {
                throw ManagerError.internalServerError('Internal Server Error');
            }
            const tokens: AuthToken = {
                accessToken,
                expiresIn: payload.exp,
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

            const user = await UserModel.findById(payload.id);
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