import { ApiOneResponse } from '../../../domain/interfaces';
import { AuthRepositoryPort } from '../../../domain/ports/secondary';
import { AuthResponseDTO, SignInDTO } from '../../../domain/entities';

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