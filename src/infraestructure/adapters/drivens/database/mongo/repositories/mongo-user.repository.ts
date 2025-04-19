import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../../../../domain/interfaces";
import { CreateUserDTO, UserResponseDTO, UpdateUserDTO } from "../../../../../../domain/entities";
import { UserDatasourcePort, UserRepositoryPort } from "../../../../../../domain/ports/secondary";

export class MongoUserRepository implements UserRepositoryPort {
    constructor(
        private readonly userDatasource: UserDatasourcePort
    ) { }
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>> {
        return this.userDatasource.create(createUserDto);
    }
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>> {
        return this.userDatasource.findAll(paginationDTO);
    }
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userDatasource.findOneById(id);
    }
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userDatasource.update(id, updateUserDTO);
    }
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.userDatasource.remove(id);
    }
}