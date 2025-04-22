import { ApiOneResponse } from "../../../../../../../shared/interfaces";
import { SignInDTO, AuthResponseDTO, SignUpDTO } from "../../../../../domain/entities";
import { AuthDatasourcePort, AuthRepositoryPort } from "../../../../../domain/ports/secondary";

export class MongoAuthRepositoryAdapter implements AuthRepositoryPort {
    constructor(
        private readonly authDatasource: AuthDatasourcePort,
    ) { }
    signIn(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authDatasource.signIn(signInDTO);
    }
    signUp(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authDatasource.signUp(signUpDTO);
    }
    refreshToken(token: string): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authDatasource.refreshToken(token);
    }
}