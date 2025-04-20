import { AuthService } from '../../../src/application/services';
import { RefreshTokenUseCase, SignInUseCase, SignUpUseCase } from '../../../src/application/use-cases/auth';
import { SignInDTO } from '../../../src/domain/entities';
import { AuthResponseDTO, SignUpDTO } from '../../../src/domain/entities/auth.entity';
import { HttpStatus, UserRole } from '../../../src/domain/enums';
import { ApiOneResponse } from '../../../src/domain/interfaces';
describe("AuthService", () => {
    it("should be defined", () => {

        // Arrange
        const authRepositoryMock = {
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn(),

        };

        const signInUserUseCase = new SignInUseCase(authRepositoryMock);
        const signUpUserUseCase = new SignUpUseCase(authRepositoryMock);
        const refreshTokenUserUseCase = new RefreshTokenUseCase(authRepositoryMock);

        const authService = new AuthService(signInUserUseCase, signUpUserUseCase, refreshTokenUserUseCase);

        // Act
        expect(authService).toBeDefined();
    });

    it("should call signIn", async () => {

        // Arrange
        const idMock = '6622c8b3e77ef741149c1a7d';
        const signInDTOMock: SignInDTO = {
            email: 'name1@gmail.com',
            password: '123456'
        }
        const authResponseDTOMock: AuthResponseDTO = {
            user: {
                id: idMock,
                name: 'name1',
                email: 'name1@gmail.com',
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            tokens: {
                accessToken: 'access',
                expiresIn: 3600,

            }
        }
        const authRepositoryMock = {
            signIn: jest.fn().mockResolvedValue(authResponseDTOMock),
            signUp: jest.fn(),
            refreshToken: jest.fn(),

        };

        const signInUserUseCase = new SignInUseCase(authRepositoryMock);
        const signUpUserUseCase = new SignUpUseCase(authRepositoryMock);
        const refreshTokenUserUseCase = new RefreshTokenUseCase(authRepositoryMock);

        const authService = new AuthService(signInUserUseCase, signUpUserUseCase, refreshTokenUserUseCase);

        jest.spyOn(authService, 'signIn');
        const signIn = await authService.signIn(signInDTOMock);
        // Act
        expect(signIn).toBe(authResponseDTOMock);
        expect(authService.signIn).toHaveBeenCalledWith(signInDTOMock);
    });

    it("should call signUp", async () => {

        // Arrange
        const idMock = '6622c8b3e77ef741149c1a7d';
        const signUpDTOMock: SignUpDTO = {
            name: 'name1',
            email: 'name1@gmail.com',
            password: '123456'
        }
        const authResponseDTOMock: AuthResponseDTO = {
            user: {
                id: idMock,
                name: 'name1',
                email: 'name1@gmail.com',
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            tokens: {
                accessToken: 'access',
                expiresIn: 3600,

            }
        }
        const authRepositoryMock = {
            signIn: jest.fn(),
            signUp: jest.fn().mockResolvedValue(authResponseDTOMock),
            refreshToken: jest.fn(),

        };

        const signInUserUseCase = new SignInUseCase(authRepositoryMock);
        const signUpUserUseCase = new SignUpUseCase(authRepositoryMock);
        const refreshTokenUserUseCase = new RefreshTokenUseCase(authRepositoryMock);

        const authService = new AuthService(signInUserUseCase, signUpUserUseCase, refreshTokenUserUseCase);

        jest.spyOn(authService, 'signUp');
        const signUp = await authService.signUp(signUpDTOMock);
        // Act
        expect(signUp).toBe(authResponseDTOMock);
        expect(authService.signUp).toHaveBeenCalledWith(signUpDTOMock);
    });

    it("should call refreshToken", async () => {

        // Arrange
        const idMock = '6622c8b3e77ef741149c1a7d';
        const tokenMock = '6622c8b3e77ef741149c1a7d';
        
        const authResponseDTOMock: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: 'OK',
                error: null,
            },
            data: {
                user: {
                    id: idMock,
                    name: 'name1',
                    email: 'name1@gmail.com',
                    roles: [UserRole.USER],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                tokens: {
                    accessToken: 'access',
                    expiresIn: 3600,
                    refreshToken: 'refreshToken'
    
                }
            }
        }
        const authRepositoryMock = {
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn().mockResolvedValue(authResponseDTOMock),

        };

        const signInUserUseCase = new SignInUseCase(authRepositoryMock);
        const signUpUserUseCase = new SignUpUseCase(authRepositoryMock);
        const refreshTokenUserUseCase = new RefreshTokenUseCase(authRepositoryMock);

        const authService = new AuthService(signInUserUseCase, signUpUserUseCase, refreshTokenUserUseCase);

        jest.spyOn(authService, 'refreshToken');
        const refreshToken = await authService.refreshToken(tokenMock);
        // Act
        expect(refreshToken).toBe(authResponseDTOMock);
        expect(authService.refreshToken).toHaveBeenCalledWith(tokenMock);
    });
});