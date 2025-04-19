import { AuthResponseDTO, SignInDTO, SignUpDTO } from "../../entities/auth.entity";
import { ApiOneResponse } from "../../interfaces/api-response.interface";

export interface AuthServicePort {
    signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
    signUp(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
    refreshToken(token: string): Promise<ApiOneResponse<AuthResponseDTO>>;
}