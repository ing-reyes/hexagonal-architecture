import { ApiOneResponse } from "../../../../../shared/interfaces";
import { AuthResponseDTO, SignInDTO, SignUpDTO } from "../../entities/auth.entity";

export interface AuthRepositoryPort {
    signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
    signUp(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
    refreshToken(token: string): Promise<ApiOneResponse<AuthResponseDTO>>;
}