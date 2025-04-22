import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../../../common/interfaces";
import { UserResponseDTO } from "../../../../../common/interfaces/user.interface";
import { CreateUserDTO, UpdateUserDTO } from "../../entities";


export interface UserRepositoryPort {
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>>;
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>>;
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>>;
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
}