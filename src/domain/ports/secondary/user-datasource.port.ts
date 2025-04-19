import { CreateUserDTO, UserResponseDTO, UpdateUserDTO } from '../../entities/user.entity';
import { PaginationDTO } from '../../../common/dtos/pagination';
import { ApiAllResponse, ApiOneResponse } from '../../interfaces/api-response.interface';

export interface UserDatasourcePort {
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>>;
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>>;
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>>;
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
}