import { AuthResponseDTO } from '../../../../src/domain/entities';
import { HttpStatus, UserRole } from '../../../../src/domain/enums';
import { ApiOneResponse } from '../../../../src/domain/interfaces';
import { RefreshTokenUseCase } from '../../../../src/application/use-cases/auth/refresh-token.use-case';
describe("SignInUseCase", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should refresh token", async () => {
        // Arrange
        const tokenMock = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDFlZmJmMmVmNDgzZmE0NjY4Y2IxZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzQ1MTg5ODg4LCJleHAiOjE3NDUyMjU4ODh9.bAI0qg8JsHVvfFW6hVd7z0MwkDSrv3Q45UoXot-bkbE";
        const idMock = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        
        const authResponseDTO: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null

            },
            data: {
                user: {
                    name: 'name1',
                    email: 'name1@google.com',
                    roles: [UserRole.USER],
                    id: idMock,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                tokens: {
                    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDFlZmJmMmVmNDgzZmE0NjY4Y2IxZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzQ1MTg5ODg4LCJleHAiOjE3NDUyMjU4ODh9.bAI0qg8JsHVvfFW6hVd7z0MwkDSrv3Q45UoXot-bkbE",
                    expiresIn: 1745225888
                }
            }
        }

        const authRepositoryMock = {
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn().mockResolvedValue(authResponseDTO),
        }

        const useCase = new RefreshTokenUseCase(authRepositoryMock);

        // Act
        jest.spyOn(useCase, 'execute');
        const result = await useCase.execute(tokenMock);

        // Assert
        expect(await useCase.execute).toHaveBeenCalledWith(tokenMock);
        expect(result).toEqual(authResponseDTO);
    });
});