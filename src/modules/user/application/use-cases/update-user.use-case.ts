import { ApiOneResponse } from "../../../../shared/interfaces";
import { UpdateUserDTO, UserResponseDTO } from "../../domain/entities";
import { UserRepositoryPort } from "../../domain/ports/secondary";

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