import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../../../shared/interfaces";
import { UserResponseDTO } from "../../../../../shared/interfaces/user.interface";
import { CreateUserDTO, UpdateUserDTO } from "../../entities";


export interface UserServicePort {
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>>;
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>>;
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>>;
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>>;
}