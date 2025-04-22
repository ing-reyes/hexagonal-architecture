import { ApiAllResponse, PaginationDTO, UserResponseDTO } from "../../../../shared/interfaces";
import { UserRepositoryPort } from "../../domain/ports/secondary";

interface UseCase {
    execute(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>>
}

export class FindAllUsersUseCase implements UseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }
    execute(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>> {
        return this.userRepository.findAll(paginationDTO);
    }
}