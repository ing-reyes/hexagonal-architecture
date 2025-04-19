import { CreateUserDTO, UserResponseDTO, UpdateUserDTO } from '../../entities/user.entity';
import { PaginationDTO } from '../../interfaces';
import { ApiAllResponse, ApiOneResponse } from '../../interfaces/api-response.interface';

export interface UserRepositoryPort {
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>>;
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>>;
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>>;
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
}