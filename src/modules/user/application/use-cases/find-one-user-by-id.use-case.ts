import { ApiOneResponse } from "../../../../shared/interfaces";
import { UserResponseDTO } from "../../domain/entities";
import { UserRepositoryPort } from "../../domain/ports/secondary";

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