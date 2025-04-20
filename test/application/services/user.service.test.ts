import { UserService } from '../../../src/application/services';
import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserByIdUseCase, RemoveUserUseCase, UpdateUserUseCase } from '../../../src/application/use-cases/user';
import { CreateUserDTO, UserResponseDTO } from '../../../src/domain/entities';
import { HttpStatus, UserRole } from '../../../src/domain/enums';
import { ApiAllResponse, ApiOneResponse } from '../../../src/domain/interfaces';
describe("UserService", () => {

    it("should be defined", () => {

        // Arrange
        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };;
        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        expect(userService).toBeDefined();
    });

    it("should call create", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d"
        const createUserDTOMock: CreateUserDTO = {
            name: 'name1',
            email: 'name@gmail.com',
            password: '123456',
        };

        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null,
            },
            data: {
                ...createUserDTOMock,
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                id: idMock,

            }
        }

        const userRepositoryMock = {
            create: jest.fn().mockResolvedValue(userResponseDTOMock),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        jest.spyOn(userService, 'create');
        const result = await userService.create(createUserDTOMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDTOMock);
    });

    it("should call findAll", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d"

        const metaMock = {
            page: 1,
            lastPage: 1,
            limit: 10,
            total: 1,
        }

        const paginationDTOMock = {
            page: 1,
            limit: 10,
        }

        const usersMock: UserResponseDTO[] = [
            {
                name: 'name1',
                email: 'name1@gmail.com',
                id: idMock,
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]

        const userResponseDTOMock: ApiAllResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null,
            },
            meta: metaMock,
            data: usersMock,
        }

        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(userResponseDTOMock),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        jest.spyOn(userService, 'findAll');
        const result = await userService.findAll(paginationDTOMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userRepositoryMock.findAll).toHaveBeenCalledWith(paginationDTOMock);
    });

    it("should call findOne", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d"

        const userResponseDTOMock: UserResponseDTO =
        {
            name: 'name1',
            email: 'name1@gmail.com',
            id: idMock,
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn().mockResolvedValue(userResponseDTOMock),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        jest.spyOn(userService, 'findOneById');
        const result = await userService.findOneById(idMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userService.findOneById).toHaveBeenCalledWith(idMock);
    });

    it("should call update", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d"
        const updateUserDTOMock: CreateUserDTO = {
            name: 'name1',
            email: 'name@gmail.com',
            password: '123456',
        };

        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null,
            },
            data: {
                ...updateUserDTOMock,
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                id: idMock,

            }
        }

        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn().mockResolvedValue(userResponseDTOMock),
            remove: jest.fn(),
        };

        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        jest.spyOn(userService, 'update');
        const result = await userService.update(idMock, updateUserDTOMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userService.update).toHaveBeenCalledWith(idMock, updateUserDTOMock);
    });

    it("should call remove", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d"

        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null,
            },
            data: {
                id: idMock,
                name: 'name1',
                email: 'name1@gmail.com',
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }

        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn().mockResolvedValue(userResponseDTOMock),
        };

        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);
        const fildAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        const fineOneUserUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const userService = new UserService(createUserUseCase, fildAllUsersUseCase, fineOneUserUseCase, updateUserUseCase, removeUserUseCase);

        // Act
        jest.spyOn(userService, 'remove');
        const result = await userService.remove(idMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userService.remove).toHaveBeenCalledWith(idMock);
    });
});