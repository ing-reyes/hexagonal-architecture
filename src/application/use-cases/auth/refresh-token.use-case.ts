import { ApiOneResponse } from '../../../domain/interfaces';
import { AuthRepositoryPort } from '../../../domain/ports/secondary';
import { AuthResponseDTO } from '../../../domain/entities';

interface UseCase {
    execute(token: string): Promise<ApiOneResponse<AuthResponseDTO>>;
}

export class RefreshTokenUseCase implements UseCase {
    constructor(
        private readonly authRepository: AuthRepositoryPort,
    ) { }
    execute(token: string): Promise<ApiOneResponse<AuthResponseDTO>> {
        return this.authRepository.refreshToken(token);
    }
}