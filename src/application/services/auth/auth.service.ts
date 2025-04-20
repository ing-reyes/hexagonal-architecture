import { AuthResponseDTO, SignInDTO, SignUpDTO } from "../../../domain/entities";
import { ApiOneResponse } from "../../../domain/interfaces";
import { AuthServicePort } from "../../../domain/ports/primary";
import { RefreshTokenUseCase, SignInUseCase, SignUpUseCase } from "../../use-cases/auth";


export class AuthService implements AuthServicePort {
    constructor(
        private readonly signInUseCase: SignInUseCase,
        private readonly signUpUseCase: SignUpUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
    ) { }
    signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.signInUseCase.execute(signInDTO);
    }
    signUp(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.signUpUseCase.execute(signUpDTO);
    }
    refreshToken(token: string): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.refreshTokenUseCase.execute(token);
    }
}