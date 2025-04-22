import { ApiOneResponse } from "../../../../shared/interfaces";
import { AuthResponseDTO } from "../../domain/entities";
import { AuthRepositoryPort } from "../../domain/ports/secondary";


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