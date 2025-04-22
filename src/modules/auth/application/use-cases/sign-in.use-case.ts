import { ApiOneResponse } from "../../../../shared/interfaces";
import { AuthResponseDTO, SignInDTO } from "../../domain/entities";
import { AuthRepositoryPort } from "../../domain/ports/secondary";


interface UseCase {
    execute(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
}

export class SignInUseCase implements UseCase {
    constructor(
        private readonly authRepository: AuthRepositoryPort,
    ) { }
    execute(signInDTO: SignInDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authRepository.signIn(signInDTO);
    }
}