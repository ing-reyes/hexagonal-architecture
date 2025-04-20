import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../domain/interfaces";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../../../domain/entities";
import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserByIdUseCase, RemoveUserUseCase, UpdateUserUseCase } from "../../use-cases/user";
import { UserServicePort } from "../../../domain/ports/primary";

export class UserService implements UserServicePort {
    constructor(
        private readonly createUseUseCase: CreateUserUseCase,
        private readonly findAllUsersUseCase: FindAllUsersUseCase,
        private readonly findOneUserByIdUseCase: FindOneUserByIdUseCase,
        private readonly updateUseUseCase: UpdateUserUseCase,
        private readonly removeUserUseCase: RemoveUserUseCase,
    ) { }
    create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>> {
        return this.createUseUseCase.execute(createUserDto);
    }
    findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>> {
        return this.findAllUsersUseCase.execute(paginationDTO);
    }
    findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.findOneUserByIdUseCase.execute(id);
    }
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.updateUseUseCase.execute(id, updateUserDTO);
    }
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        return this.removeUserUseCase.execute(id);
    }
}