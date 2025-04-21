import { MongoUserDatasourceAdapter } from '../../../../../../src/infraestructure/adapters/drivens/database/mongo/datasources/mongo-user.datasource';
import { BcryptAdapter } from '../../../../../../src/common/config';
import { UserModel } from '../../../../../../src/infraestructure/adapters/drivens/database/mongo/models';
import { UserMapper } from '../../../../../../src/infraestructure/adapters/drivens/database/mongo/mappers';
import { CreateUserDTO, UserResponseDTO } from '../../../../../../src/domain/entities';
import { HttpStatus, UserRole } from '../../../../../../src/domain/enums';
import { ApiAllResponse, ApiOneResponse, Metadata, PaginationDTO } from '../../../../../../src/domain/interfaces';
import { ManagerError } from '../../../../../../src/common/errors';

jest.mock('../../../../../../src/infraestructure/adapters/drivens/database/mongo/models');
jest.mock('../../../../../../src/infraestructure/adapters/drivens/database/mongo/mappers');

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


        // Call throw ManagerError.conflict('User not created');
        (UserModel.create as jest.Mock).mockResolvedValue(null); // Simulate user not created

        // Act & Assert
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
        
        // Simulate an error in the database query
        (UserModel.countDocuments as jest.Mock).mockRejectedValue(new Error('Database error'));

        // Act & Assert
        await expect(mongoUserDatasourceAdapter.findAll(paginationDTOMock)).rejects.toThrowError(
            new Error('Database error')
        );
    });
});