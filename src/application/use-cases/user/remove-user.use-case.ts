import { UserResponseDTO } from "../../../domain/entities";
import { ApiOneResponse } from "../../../domain/interfaces";
import { UserRepositoryPort } from '../../../domain/ports/secondary';

interface UseCase {
    execute(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>
}

export class RemoveUserUseCase implements UseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }
    execute(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userRepository.remove(id);
    }
}