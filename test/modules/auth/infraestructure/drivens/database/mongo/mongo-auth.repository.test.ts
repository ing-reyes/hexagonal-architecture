import { AuthResponseDTO, AuthToken, SignInDTO, SignUpDTO, UserAuth } from '../../../../../../../src/modules/auth/domain/entities';
import { MongoAuthRepositoryAdapter } from '../../../../../../../src/modules/auth/infraestructure/adapters/drivens/database/mongo';
import { HttpStatus, UserRole } from '../../../../../../../src/shared/enums';
import { ApiOneResponse } from '../../../../../../../src/shared/interfaces';
describe("MongoAuthRepositoryAdapter", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        // Arrange
        const mongoAuthDatasourceAdapterMock = {
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn(),
        }
        // Act
        const mongoAuthRepositoryAdapter = new MongoAuthRepositoryAdapter(mongoAuthDatasourceAdapterMock);

        // Assert
        expect(mongoAuthRepositoryAdapter).toBeDefined();
    });

    it("should be call sign in", async () => {
        // Arrange
        const idMock = '1234567890abcdef12345678';
        const signInDTOMock: SignInDTO = {
            email: 'gmail.com',
            password: '123456'
        }
        const userAuthMock: UserAuth = {
            id: idMock,
            name: 'name1',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const tokensMock: AuthToken = {
            accessToken: '1234567890abcdef12345678',
            expiresIn: 1212121212
        }
        const authResponseDTOMock: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                user: userAuthMock,
                tokens: tokensMock,
            }
        }
        const mongoAuthDatasourceAdapterMock = {
            signIn: jest.fn().mockResolvedValue(authResponseDTOMock),
            signUp: jest.fn(),
            refreshToken: jest.fn(),
        }
        // Act
        const mongoAuthRepositoryAdapter = new MongoAuthRepositoryAdapter(mongoAuthDatasourceAdapterMock);
        jest.spyOn(mongoAuthRepositoryAdapter, 'signIn');
        const result = await mongoAuthRepositoryAdapter.signIn(signInDTOMock);

        // Assert
        expect(result).toEqual(authResponseDTOMock);
        expect(mongoAuthDatasourceAdapterMock.signIn).toHaveBeenCalledWith(signInDTOMock);
    });

    it("should be call sign up", async () => {
        // Arrange
        const idMock = '1234567890abcdef12345678';
        const signUpDTOMock: SignUpDTO = {
            name: 'name1',
            email: 'name1@gmail.com',
            password: '123456'
        }
        const userAuthMock: UserAuth = {
            id: idMock,
            name: 'name1',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const tokensMock: AuthToken = {
            accessToken: '1234567890abcdef12345678',
            expiresIn: 1212121212
        }
        const authResponseDTOMock: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                user: userAuthMock,
                tokens: tokensMock,
            }
        }
        const mongoAuthDatasourceAdapterMock = {
            signIn: jest.fn(),
            signUp: jest.fn().mockResolvedValue(authResponseDTOMock),
            refreshToken: jest.fn(),
        }
        // Act
        const mongoAuthRepositoryAdapter = new MongoAuthRepositoryAdapter(mongoAuthDatasourceAdapterMock);
        jest.spyOn(mongoAuthRepositoryAdapter, 'signUp');
        const result = await mongoAuthRepositoryAdapter.signUp(signUpDTOMock);

        // Assert
        expect(result).toEqual(authResponseDTOMock);
        expect(mongoAuthDatasourceAdapterMock.signUp).toHaveBeenCalledWith(signUpDTOMock);
    });

    it("should be refresh token", async () => {
        // Arrange
        const idMock = '1234567890abcdef12345678';
        const tokenMock = '1234567890abcdef12345678';

        const userAuthMock: UserAuth = {
            id: idMock,
            name: 'name1',
            email: 'name1@gmail.com',
            roles: [UserRole.USER],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const tokensMock: AuthToken = {
            accessToken: tokenMock,
            expiresIn: 1212121212
        }
        const authResponseDTOMock: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                user: userAuthMock,
                tokens: tokensMock,
            }
        }
        const mongoAuthDatasourceAdapterMock = {
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn().mockResolvedValue(authResponseDTOMock),
        }
        // Act
        const mongoAuthRepositoryAdapter = new MongoAuthRepositoryAdapter(mongoAuthDatasourceAdapterMock);
        jest.spyOn(mongoAuthRepositoryAdapter, 'refreshToken');
        const result = await mongoAuthRepositoryAdapter.refreshToken(tokenMock);

        // Assert
        expect(result).toEqual(authResponseDTOMock);
        expect(mongoAuthDatasourceAdapterMock.refreshToken).toHaveBeenCalledWith(tokenMock);
    });
});