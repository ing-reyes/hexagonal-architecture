import { CreateUserDTO, UpdateUserDTO } from '../../../../../../../src/modules/user/domain/entities';
import { MongoUserRepositoryAdapter } from '../../../../../../../src/modules/user/infraestructure/adapters/drivens/database/mongo/mongo-user.repository';
import { HttpStatus, UserRole } from '../../../../../../../src/shared/enums';
import { ApiAllResponse, ApiOneResponse, Metadata, PaginationDTO, UserResponseDTO } from '../../../../../../../src/shared/interfaces';

describe("MongoUserRepositoryAdapter", () => {
    
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        // Arrange
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        }

        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        // Act
        // Assert

        expect(mongoUserRepositoryAdapter).toBeDefined();
    });

    it("should be create a user", async () => {
        // Arrange
        const idMock = 'adasdalsdjalsdjalsdhalsd';
        const createUserDto: CreateUserDTO = {
            name: 'name1',
            email: 'name1@gmail.com',
            password: '123456'
        }
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                ...createUserDto,
                id: idMock,
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn().mockResolvedValue(userResponseDTOMock),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        }

        // Act
        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        jest.spyOn(mongoUserRepositoryAdapter, 'create');
        const result = await mongoUserRepositoryAdapter.create(createUserDto);

        // Assert
        expect(mongoUserRepositoryAdapter.create).toHaveBeenCalledWith(createUserDto);
        expect(result).toEqual(userResponseDTOMock);
    });

    it("should be find all users", async () => {
        // Arrange
        const idMock = 'adasdalsdjalsdjalsdhalsd';
        const usersMock: UserResponseDTO[] = [
            { id: idMock, name: 'name1', email: 'name1@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
            { id: idMock, name: 'name2', email: 'name2@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
            { id: idMock, name: 'name3', email: 'name3@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
            { id: idMock, name: 'name4', email: 'name4@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
            { id: idMock, name: 'name5', email: 'name5@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
            { id: idMock, name: 'name6', email: 'name6@gmail.com', roles: [UserRole.USER], createdAt: new Date(), updatedAt: new Date() },
        ];
        const paginationDTOMock: PaginationDTO = {
            page: 1,
            limit: 10
        }
        const meta: Metadata = {
            page: paginationDTOMock.page,
            lastPage: 1,
            limit: paginationDTOMock.limit,
            total: usersMock.length
        }
        const usersResponseDTOMock: ApiAllResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            meta: meta,
            data: usersMock
        }
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(usersResponseDTOMock),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        }

        // Act
        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        jest.spyOn(mongoUserRepositoryAdapter, 'findAll');
        const result = await mongoUserRepositoryAdapter.findAll(paginationDTOMock);

        // Assert
        expect(mongoUserRepositoryAdapter.findAll).toHaveBeenCalledWith(paginationDTOMock);
        expect(result).toEqual(usersResponseDTOMock);
    });

    it("should be find one by id user", async () => {
        // Arrange
        const idMock = 'adasdalsdjalsdjalsdhalsd';
        const usersMock: UserResponseDTO = { 
            id: idMock, 
            name: 'name1', 
            email: 'name1@gmail.com', 
            roles: [UserRole.USER], 
            createdAt: new Date(), 
            updatedAt: new Date() 
        };
        
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: usersMock
        }
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn().mockResolvedValue(userResponseDTOMock),
            update: jest.fn(),
            remove: jest.fn(),
        }

        // Act
        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        jest.spyOn(mongoUserRepositoryAdapter, 'findOneById');
        const result = await mongoUserRepositoryAdapter.findOneById(idMock);

        // Assert
        expect(mongoUserRepositoryAdapter.findOneById).toHaveBeenCalledWith(idMock);
        expect(result).toEqual(userResponseDTOMock);
    });

    it("should be update a user", async () => {
        // Arrange
        const idMock = 'adasdalsdjalsdjalsdhalsd';
        const updateUserMock: UpdateUserDTO = { 
            name: 'name1', 
            email: 'name1@gmail.com',
            password: '123456',
        };
        
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: idMock,
                name: updateUserMock.name!,
                email: updateUserMock.email!,
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn().mockResolvedValue(userResponseDTOMock),
            remove: jest.fn(),
        }

        // Act
        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        jest.spyOn(mongoUserRepositoryAdapter, 'update');
        const result = await mongoUserRepositoryAdapter.update(idMock, updateUserMock);

        // Assert
        expect(mongoUserRepositoryAdapter.update).toHaveBeenCalledWith(idMock, updateUserMock);
        expect(result).toEqual(userResponseDTOMock);
    });

    it("should be remove one user", async () => {
        // Arrange
        const idMock = 'adasdalsdjalsdjalsdhalsd';
        
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: idMock,
                name: 'name1'!,
                email: 'name1@gmail.com',
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }
        const mongoUserDatasourceAdapterMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn().mockResolvedValue(userResponseDTOMock),
        }

        // Act
        const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(mongoUserDatasourceAdapterMock);
        jest.spyOn(mongoUserRepositoryAdapter, 'remove');
        const result = await mongoUserRepositoryAdapter.remove(idMock);

        // Assert
        expect(mongoUserRepositoryAdapter.remove).toHaveBeenCalledWith(idMock);
        expect(result).toEqual(userResponseDTOMock);
    });
});