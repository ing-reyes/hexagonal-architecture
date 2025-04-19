import { ApiAllResponse, PaginationDTO } from "../../../domain/interfaces";
import { UserRepositoryPort } from '../../../domain/ports/secondary';
import { UserResponseDTO } from "../../../domain/entities";

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