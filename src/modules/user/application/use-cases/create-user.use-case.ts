import { ApiOneResponse, UserResponseDTO } from "../../../../shared/interfaces";
import { CreateUserDTO } from "../../domain/entities";
import { UserRepositoryPort } from "../../domain/ports/secondary";


interface UseCase {
    execute(createUseDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>>
}

export class CreateUserUseCase implements UseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }
    execute(createUseDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>> {
        return this.userRepository.create(createUseDto);
    }
}