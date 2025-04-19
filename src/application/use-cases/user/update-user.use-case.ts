import { ApiOneResponse } from '../../../domain/interfaces';
import { UserRepositoryPort } from '../../../domain/ports/secondary';
import { UserResponseDTO, UpdateUserDTO } from '../../../domain/entities';

interface UseCase {
    execute(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>>
}

export class UpdateUserUseCase implements UseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }
    execute(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userRepository.update(id, updateUserDTO);
    }
}