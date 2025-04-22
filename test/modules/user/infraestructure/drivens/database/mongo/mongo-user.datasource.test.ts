import { BcryptAdapter } from '../../../../../../../src/shared/config/bcrypt.config';
import { MongoUserDatasourceAdapter, UserMapper } from '../../../../../../../src/modules/user/infraestructure/adapters/drivens/database/mongo';
import { CreateUserDTO } from '../../../../../../../src/modules/user/domain/entities';
import { HttpStatus, UserRole } from '../../../../../../../src/shared/enums';
import { ApiAllResponse, ApiOneResponse, Metadata, PaginationDTO, UserResponseDTO } from '../../../../../../../src/shared/interfaces';
import { UserModel } from '../../../../../../../src/shared/data';
import { ManagerError } from '../../../../../../../src/shared/errors';


jest.mock('../../../../../../../src/shared/data/mongodb/models/user.model', () => ({
    UserModel: {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        countDocuments: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
    },
}));

jest.mock('../../../../../../../src/modules/user/infraestructure/adapters/drivens/database/mongo/user.mapper', () => ({
    UserMapper: {
        modelUserToEntity: jest.fn(),
    },
}));

describe('MongoUserDatasourceAdapter', () => {
    let bcryptAdapterMock: BcryptAdapter;
    let mongoUserDatasourceAdapter: MongoUserDatasourceAdapter;

    beforeEach(() => {
        jest.clearAllMocks();

        bcryptAdapterMock = {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
            compare: jest.fn(),
        } as unknown as BcryptAdapter;

        mongoUserDatasourceAdapter = new MongoUserDatasourceAdapter(bcryptAdapterMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user without impacting the database', async () => {
        // Arrange
        const createUserDto: CreateUserDTO = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        const mockedUser = {
            _id: 'mockedUserId',
            name: createUserDto.name,
            email: createUserDto.email,
            password: 'hashedPassword',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true), // Mock save method
        };

        const expectedResponse: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: mockedUser._id,
                name: mockedUser.name,
                email: mockedUser.email,
                roles: mockedUser.roles,
                createdAt: mockedUser.createdAt,
                updatedAt: mockedUser.updatedAt,
            },
        };

        (UserModel.create as jest.Mock).mockResolvedValue(mockedUser);
        (UserMapper.modelUserToEntity as jest.Mock).mockReturnValue(expectedResponse.data);

        // Act
        const result = await mongoUserDatasourceAdapter.create(createUserDto);
        // Assert
        expect(result).toEqual(expectedResponse);
        expect(bcryptAdapterMock.hash).toHaveBeenCalledWith(createUserDto.password);
        expect(UserMapper.modelUserToEntity).toHaveBeenCalledWith(mockedUser);


        // // Call throw ManagerError.conflict('User not created');
        (UserModel.create as jest.Mock).mockResolvedValue(null); // Simulate user not created

        // // Act & Assert
        await expect(mongoUserDatasourceAdapter.create(createUserDto)).rejects.toThrowError(
            ManagerError.conflict('User not created')
        );
    });

    it('should find all users without impacting the database', async () => {
        // Arrange
        const mockedUsers: UserResponseDTO[] = [
            {
                id: 'mockedUserId',
                name: 'name',
                email: 'name1@gmail.com',
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        const paginationDTOMock: PaginationDTO = {
            page: 1,
            limit: 10
        }
        const metadata: Metadata = {
            page: paginationDTOMock.page,
            lastPage: Math.ceil(mockedUsers.length / paginationDTOMock.limit),
            limit: paginationDTOMock.limit,
            total: mockedUsers.length
        }

        const expectedResponse: ApiAllResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            meta: metadata,
            data: mockedUsers.map((user) => ({
                id: user.id, // Map _id to id
                name: user.name,
                email: user.email,
                roles: user.roles,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
        };

        (UserModel.find as jest.Mock).mockReturnValue({
            skip: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue(mockedUsers), // Return mockedUsers array
            })),
        });
        (UserModel.countDocuments as jest.Mock).mockResolvedValue(mockedUsers.length); // Mock total count
        (UserMapper.modelUserToEntity as jest.Mock).mockImplementation((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        // Act
        const result = await mongoUserDatasourceAdapter.findAll(paginationDTOMock);

        // Assert
        expect(result).toEqual(expectedResponse);

        // // Simulate an error in the database query
        (UserModel.countDocuments as jest.Mock).mockRejectedValue(new Error('Database error'));

        // // Act & Assert
        await expect(mongoUserDatasourceAdapter.findAll(paginationDTOMock)).rejects.toThrowError(
            new Error('Database error')
        );
    });

    it('should find one user without impacting the database', async () => {
        // Arrange
        const mockedUser =
        {
            _id: 'mockedUserId',
            name: 'name',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const expectedResponse: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: mockedUser._id, // Map _id to id
                name: mockedUser.name,
                email: mockedUser.email,
                roles: mockedUser.roles,
                createdAt: mockedUser.createdAt,
                updatedAt: mockedUser.updatedAt,
            }
        };

        (UserModel.findOne as jest.Mock).mockReturnValue(mockedUser);
        (UserMapper.modelUserToEntity as jest.Mock).mockImplementation((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        // Act
        const result = await mongoUserDatasourceAdapter.findOneById( mockedUser._id );

        // Assert
        expect(result).toEqual(expectedResponse);

        // Simulate a user null response
        (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate user not found
        const expectedResponseNull: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: null,
        };
        const resultNull = await mongoUserDatasourceAdapter.findOneById( mockedUser._id ); 
        expect(resultNull).toEqual(expectedResponseNull);


        // // Simulate an error in the database query
        (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
        // // Act & Assert
        await expect(mongoUserDatasourceAdapter.findOneById(mockedUser._id)).rejects.toThrowError(
            new Error('Database error')
        );
    });

    it('should update user without impacting the database', async () => {
        // Arrange
        const mockedUser =
        {
            _id: 'mockedUserId',
            name: 'name',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true), // Mock save method
        }

        const mockedUserUpdated = {
            name: 'updatedName',
        }

        const expectedResponse: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: mockedUser._id, // Map _id to id
                name: mockedUser.name,
                email: mockedUser.email,
                roles: mockedUser.roles,
                createdAt: mockedUser.createdAt,
                updatedAt: mockedUser.updatedAt,
            }
        };

        (UserModel.findOneAndUpdate as jest.Mock).mockReturnValue(mockedUser);
        (UserMapper.modelUserToEntity as jest.Mock).mockImplementation((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        // Act
        const result = await mongoUserDatasourceAdapter.update( mockedUser._id, mockedUserUpdated ); // Pass the mockedUserUpdated object

        // Assert
        expect(result).toEqual(expectedResponse);

        // Simulate a user null response
        (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null); // Simulate user not found
        const expectedResponseNull: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: null,
        };
        const resultNull = await mongoUserDatasourceAdapter.update( mockedUser._id, mockedUserUpdated ); 
        expect(resultNull).toEqual(expectedResponseNull);


        // // Simulate an error in the database query
        (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));
        // // Act & Assert
        await expect(mongoUserDatasourceAdapter.update(mockedUser._id, mockedUserUpdated)).rejects.toThrowError(
            new Error('Database error')
        );
    });

    it('should remove user without impacting the database', async () => {
        // Arrange
        const mockedUser =
        {
            _id: 'mockedUserId',
            name: 'name',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true), // Mock save method
        }

        const expectedResponse: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                id: mockedUser._id, // Map _id to id
                name: mockedUser.name,
                email: mockedUser.email,
                roles: mockedUser.roles,
                createdAt: mockedUser.createdAt,
                updatedAt: mockedUser.updatedAt,
            }
        };

        (UserModel.findOneAndDelete as jest.Mock).mockReturnValue(mockedUser);
        (UserMapper.modelUserToEntity as jest.Mock).mockImplementation((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        // Act
        const result = await mongoUserDatasourceAdapter.remove( mockedUser._id ); // Pass the mockedUserUpdated object

        // Assert
        expect(result).toEqual(expectedResponse);

        // Simulate a user null response
        (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(null); // Simulate user not found
        const expectedResponseNull: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: null,
        };
        const resultNull = await mongoUserDatasourceAdapter.remove( mockedUser._id ); 
        expect(resultNull).toEqual(expectedResponseNull);


        // // Simulate an error in the database query
        (UserModel.findOneAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));
        // // Act & Assert
        await expect(mongoUserDatasourceAdapter.remove(mockedUser._id)).rejects.toThrowError(
            new Error('Database error')
        );
    });
});