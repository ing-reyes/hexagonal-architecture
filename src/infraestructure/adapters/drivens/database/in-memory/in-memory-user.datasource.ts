import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../../../domain/interfaces";
import { CreateUserDTO, UpdateUserDTO, User, UserResponseDTO } from "../../../../../domain/entities";
import { HttpStatus } from "../../../../../domain/enums/http-status.enum";
import { UserDatasourcePort } from "../../../../../domain/ports/secondary";
import { UserMapper } from "../mongo/mappers";
import { UserRole } from "../../../../../domain/enums";

export class InMemoryUserDatasourceAdapter implements UserDatasourcePort {
    private readonly users: User[] = [
        { id: '1', name: 'name1', email: 'email1@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'name2', email: 'email2@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'name3', email: 'email3@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'name4', email: 'email4@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'name5', email: 'email5@google.com', password: '123456', roles: [UserRole.USER], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ]
    async create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>> {
        try {
            const newUser: User = {
                ...createUserDto,
                roles: [UserRole.USER],
                isActive: true,
                id: (this.users.length + 1).toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            this.users.push(newUser);

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: UserMapper.modelUserToEntity(newUser),
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>> {
        try {
            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                meta: {
                    page: 1,
                    lastPage: 1,
                    limit: 1,
                    total: this.users.length,
                },
                data: this.users.map(UserMapper.modelUserToEntity),
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        try {
            const user = this.users.find((user) => user.id === id);
            if (!user) {
                return {
                    status: {
                        statusCode: HttpStatus.OK,
                        statusMsg: 'OK',
                        error: null,
                    },
                    data: null,
                }
            };

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: UserMapper.modelUserToEntity(user),
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        throw new Error("Method not implemented.");
    }
}