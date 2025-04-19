import { AuthResponseDTO, SignUpDTO } from '../../../domain/entities';
import { ApiOneResponse } from '../../../domain/interfaces';
import { AuthRepositoryPort } from '../../../domain/ports/secondary';

interface UseCase {
    execute(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>>;
}

export class SignUpUseCase implements UseCase {
    constructor(
        private readonly authRepository: AuthRepositoryPort,
    ) { }
    execute(signUpDTO: SignUpDTO): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authRepository.signUp(signUpDTO);
    }
}