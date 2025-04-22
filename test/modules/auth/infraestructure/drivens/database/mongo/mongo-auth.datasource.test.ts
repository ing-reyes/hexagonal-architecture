import { BcryptAdapter } from '../../../../../../../src/shared/config/bcrypt.config';
import { HttpStatus, UserRole } from '../../../../../../../src/shared/enums';
import { ApiOneResponse } from '../../../../../../../src/shared/interfaces';
import { UserModel } from '../../../../../../../src/shared/data';
import { ManagerError } from '../../../../../../../src/shared/errors';
import { JwtConfig } from '../../../../../../../src/shared/config';
import { AuthResponseDTO, SignInDTO, SignUpDTO } from '../../../../../../../src/modules/auth/domain/entities/auth.entity';
import { MongoAuthDatasourceAdapter } from '../../../../../../../src/modules/auth/infraestructure/adapters/drivens/database/mongo/mongo-auth.datasource';
import mongoose from 'mongoose';
import { AuthMapper } from '../../../../../../../src/modules/auth/infraestructure/adapters/drivens/database/mongo/auth.mapper';

jest.mock('../../../../../../../src/shared/data/mongodb/models/user.model', () => ({
    UserModel: {
        findOne: jest.fn(),
        findOneById: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.mock('../../../../../../../src/modules/auth/infraestructure/adapters/drivens/database/mongo/auth.mapper', () => ({
    AuthMapper: {
        modelUserToEntity: jest.fn(),
    },
}));

describe('MongoAuthDatasourceAdapter', () => {
    let bcryptAdapterMock: BcryptAdapter;
    let jwtConfig: JwtConfig;
    let mongoAuthDatasourceAdapter: MongoAuthDatasourceAdapter;

    const signInDto: SignInDTO = {
        email: 'test@example.com',
        password: 'password123',
    };

    const signUpDto: SignUpDTO = {
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
    };

    const mockedUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'name1',
        email: signInDto.email,
        password: signInDto.password,
        roles: [UserRole.USER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
    };

    const expectedResponse: ApiOneResponse<AuthResponseDTO> = {
        status: {
            statusCode: HttpStatus.OK,
            statusMsg: 'OK',
            error: null,
        },
        data: {
            user: {
                id: mockedUser._id.toString(),
                name: mockedUser.name,
                email: mockedUser.email,
                roles: mockedUser.roles,
                createdAt: mockedUser.createdAt,
                updatedAt: mockedUser.updatedAt,
            },
            tokens: {
                accessToken: 'mockedAccessToken',
                expiresIn: 3600,
            }
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        bcryptAdapterMock = {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
            compare: jest.fn(),
            refresshToken: jest.fn(),
        } as unknown as BcryptAdapter;

        jwtConfig = {
            generateToken: jest.fn().mockResolvedValue('mockedAccessToken'),
            verifyToken: jest.fn().mockResolvedValue({ id: 'mockedUserId', roles: [UserRole.USER], exp: 3600, iat: 0 }),
            refresshToken: jest.fn(),
        } as unknown as JwtConfig;

        mongoAuthDatasourceAdapter = new MongoAuthDatasourceAdapter(jwtConfig, bcryptAdapterMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signIn', () => {
        it('should sign in without impacting the database', async () => {
            // Arrange
            // Simulate the behavior of the bcryptAdapterMock and UserModel
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockedUser);
            (bcryptAdapterMock.compare as jest.Mock).mockResolvedValue(true);
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue('mockedAccessToken');
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue({ id: mockedUser._id.toString(), roles: mockedUser.roles });
            (AuthMapper.modelUserToEntity as jest.Mock).mockReturnValue({
                user: {
                    id: mockedUser._id.toString(),
                    name: mockedUser.name,
                    email: mockedUser.email,
                    roles: mockedUser.roles,
                    createdAt: mockedUser.createdAt,
                    updatedAt: mockedUser.updatedAt,
                },
                tokens: {
                    accessToken: 'mockedAccessToken',
                    expiresIn: 3600,
                }
            });

            // Act
            const result = await mongoAuthDatasourceAdapter.signIn(signInDto);

            // Assert
            expect(result).toEqual(expectedResponse);
            expect(bcryptAdapterMock.compare).toHaveBeenCalledWith(signInDto.password, mockedUser.password);
        });

        it("should throw error Credentials not valid! (UserModel.finOne null) - sign in", async () => {

            // Act & Assert
            // // Call throw ManagerError.badRequest('Credentials not valid!');
            (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate user not created
            await expect(mongoAuthDatasourceAdapter.signIn(signInDto)).rejects.toEqual(
                ManagerError.badRequest('Credentials not valid!')
            );
        });

        it("should throw error Credentials not valid! (isMatch password false) - sign in", async () => {

            // Act & Assert
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockedUser);
            (bcryptAdapterMock.compare as jest.Mock).mockResolvedValue(false); // Simulate password not matching
            await expect(mongoAuthDatasourceAdapter.signIn(signInDto)).rejects.toEqual(
                ManagerError.badRequest('Credentials not valid!')
            );
        });

        it("should throw error Credentials not valid! (bcryptAdapterMock.compare false) - sign in", async () => {


            // // // Call throw ManagerError.badRequest('Credentials not valid!');
            (bcryptAdapterMock.compare as jest.Mock).mockResolvedValue(false); // Simulate password not matching
            await expect(mongoAuthDatasourceAdapter.signIn(signInDto)).rejects.toEqual(
                ManagerError.badRequest('Credentials not valid!')
            );
        });

        it("should throw error Internal Server Error (jwtConfig.generateToken null) - sign in", async () => {
            // Mock to make the previous if statements pass
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockedUser);
            (bcryptAdapterMock.compare as jest.Mock).mockResolvedValue(true);

            // // // Call throw ManagerError.internalServerError('Internal Server Error');
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue(null) // Simulate token generation failure
            await expect(mongoAuthDatasourceAdapter.signIn(signInDto)).rejects.toEqual(
                ManagerError.internalServerError('Internal Server Error')
            );
        });

        it("should throw error Internal Server Error (jwtConfig.verifyToken null) - sign in", async () => {

            // Mock to make the previous if statements pass
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockedUser);
            (bcryptAdapterMock.compare as jest.Mock).mockResolvedValue(true);

            // Simulate that the token generation fails
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue("mockedAccessToken");
            // // // // // Call throw ManagerError.internalServerError('Internal Server Error');
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue(null); // Simulate token verification failure
            await expect(mongoAuthDatasourceAdapter.signIn(signInDto)).rejects.toEqual(
                ManagerError.internalServerError('Internal Server Error')
            );
        });
    });

    describe('signUp', () => {
        it('should sign up without impacting the database', async () => {
            // Arrange
            // Simulate the behavior of the bcryptAdapterMock and UserModel
            (UserModel.findOne as jest.Mock).mockResolvedValue(null);
            (UserModel.create as jest.Mock).mockResolvedValue(mockedUser);
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue('mockedAccessToken');
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue({ id: mockedUser._id.toString(), roles: mockedUser.roles });
            (AuthMapper.modelUserToEntity as jest.Mock).mockReturnValue({
                user: {
                    id: mockedUser._id.toString(),
                    name: mockedUser.name,
                    email: mockedUser.email,
                    roles: mockedUser.roles,
                    createdAt: mockedUser.createdAt,
                    updatedAt: mockedUser.updatedAt,
                },
                tokens: {
                    accessToken: 'mockedAccessToken',
                    expiresIn: 3600,
                }
            });

            // Act
            const result = await mongoAuthDatasourceAdapter.signUp(signUpDto);

            // Assert
            expect(result).toEqual(expectedResponse);
            expect(bcryptAdapterMock.hash).toHaveBeenCalledWith(signUpDto.password);
        });

        it("should throw error Email not available (UserModel.finOne exist) - sign up", async () => {

            // Act & Assert
            // // Call throw ManagerError.badRequest('Credentials not valid!');
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockedUser); // Simulate user not created
            await expect(mongoAuthDatasourceAdapter.signUp(signUpDto)).rejects.toEqual(
                ManagerError.conflict('Email not available')
            );
        });

        it("should throw error user not created (UserModel.create null) - sign up", async () => {

            (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate user not found
            (UserModel.create as jest.Mock).mockImplementation(jest.fn().mockResolvedValue(null)); // Simulate user not created
            await expect(mongoAuthDatasourceAdapter.signUp(signUpDto)).rejects.toEqual(
                ManagerError.conflict('User not created')
            );
        });

        it("should throw Internal Server Error (jwtConfig.generateToken null) - sign up", async () => {

            (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate user not found
            (UserModel.create as jest.Mock).mockImplementation(jest.fn().mockResolvedValue(mockedUser)); // Simulate user created
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue(null) // Simulate token generation failure
            await expect(mongoAuthDatasourceAdapter.signUp(signUpDto)).rejects.toEqual(
                ManagerError.internalServerError('Internal Server Error')
            );
        });

        it("should throw Internal Server Error (jwtConfig.verifyToken null) - sign up", async () => {

            (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate user not found
            (UserModel.create as jest.Mock).mockImplementation(jest.fn().mockResolvedValue(mockedUser)); // Simulate user created
            (jwtConfig.generateToken as jest.Mock).mockResolvedValue("mockAccessToken"); // Simulate token generation success
            (jwtConfig.verifyToken as jest.Mock).mockImplementation(() => Promise.resolve(null)); // Simulate token verify failure
            await expect(mongoAuthDatasourceAdapter.signUp(signUpDto)).rejects.toEqual(
                ManagerError.internalServerError('Internal Server Error')
            );
        });
    });

    describe('refreshToken', () => {
        it('should refresh the token - refreshToken', async () => {
            // Arrange
            // Simulate the behavior of the bcryptAdapterMock and UserModel
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue({ id: mockedUser._id.toString(), roles: mockedUser.roles });
            (UserModel.findById as jest.Mock).mockResolvedValue(mockedUser);
            (jwtConfig.refresshToken as jest.Mock).mockImplementation(() => Promise.resolve('mockedRefreshToken'));
            (AuthMapper.modelUserToEntity as jest.Mock).mockReturnValue({
                user: {
                    id: mockedUser._id.toString(),
                    name: mockedUser.name,
                    email: mockedUser.email,
                    roles: mockedUser.roles,
                    createdAt: mockedUser.createdAt,
                    updatedAt: mockedUser.updatedAt,
                },
                tokens: {
                    accessToken: 'mockedAccessToken',
                    refreshToken: 'mockedRefreshToken',
                    expiresIn: 3600,
                }
            });
            
            // Act
            const result = await mongoAuthDatasourceAdapter.refreshToken('mockedRefreshToken');

            // Assert
            expect(result).toEqual({
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: {
                    user: {
                        id: mockedUser._id.toString(),
                        name: mockedUser.name,
                        email: mockedUser.email,
                        roles: mockedUser.roles,
                        createdAt: mockedUser.createdAt,
                        updatedAt: mockedUser.updatedAt,
                    },
                    tokens: {
                        accessToken: 'mockedAccessToken',
                        refreshToken: 'mockedRefreshToken',
                        expiresIn: 3600,
                    }
                },
            });
            expect(jwtConfig.verifyToken).toHaveBeenCalledWith('mockedRefreshToken');
        });

        it('should throw Unauthorized (jwtConfig.verifyToken false) refreshToken', async () => {
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue(false);
            
            await expect(mongoAuthDatasourceAdapter.refreshToken('mockedRefreshToken')).rejects.toEqual(
                ManagerError.unauthorized('unauthorized')
            );
        });

        it('should throw Unauthorized (UserModel.findById null) refreshToken', async () => {
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue({ id: mockedUser._id.toString(), roles: mockedUser.roles });
            (UserModel.findById as jest.Mock).mockResolvedValue(null); // Simulate user not found
            await expect(mongoAuthDatasourceAdapter.refreshToken('mockedRefreshToken')).rejects.toEqual(
                ManagerError.unauthorized('unauthorized')
            );
        });

        it('should throw Unauthorized (jwtConfig.refresshToken null) refreshToken', async () => {
            (jwtConfig.verifyToken as jest.Mock).mockResolvedValue({ id: mockedUser._id.toString(), roles: mockedUser.roles });
            (UserModel.findById as jest.Mock).mockResolvedValue(mockedUser); // Simulate user not found
            (jwtConfig.refresshToken as jest.Mock).mockResolvedValue(null); // Simulate user not found
            await expect(mongoAuthDatasourceAdapter.refreshToken('mockedRefreshToken')).rejects.toEqual(
                ManagerError.unauthorized('unauthorized')
            );
        });
    });
});