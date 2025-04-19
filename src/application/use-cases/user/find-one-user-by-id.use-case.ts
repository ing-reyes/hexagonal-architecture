import { ApiOneResponse } from "../../../domain/interfaces";
import { UserRepositoryPort } from '../../../domain/ports/secondary';
import { UserResponseDTO } from "../../../domain/entities";

interface UseCase {
    execute(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>
}

export class FindOneUserByIdUseCase implements UseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }
    execute(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userRepository.findOneById(id);
    }
}