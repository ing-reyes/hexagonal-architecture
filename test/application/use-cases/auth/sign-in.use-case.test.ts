import { SignInUseCase } from '../../../../src/application/use-cases/auth/sign-in.use-case';
import { AuthResponseDTO, SignInDTO } from '../../../../src/domain/entities';
import { HttpStatus, UserRole } from '../../../../src/domain/enums';
import { ApiOneResponse } from '../../../../src/domain/interfaces';
describe("SignInUseCase", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should sign in a user", async () => {
        // Arrange
        const idMock = "6801efbf2ef483fa4668cb1d";
        const signInDTOMock: SignInDTO = {
            email: 'name1@google.com',
            password: '123456',
        }

        const authResponseDTO: ApiOneResponse<AuthResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null

            },
            data: {
                user: {
                    ...signInDTOMock,
                    roles: [UserRole.USER],
                    id: idMock,
                    name: "Name 1",
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
            signIn: jest.fn().mockResolvedValue(authResponseDTO),
            signUp: jest.fn(),
            refreshToken: jest.fn(),
        }

        const useCase = new SignInUseCase(authRepositoryMock);

        // Act
        jest.spyOn(useCase, 'execute');
        const result = await useCase.execute(signInDTOMock);

        // Assert
        expect(await useCase.execute).toHaveBeenCalledWith(signInDTOMock);
        expect(result).toEqual(authResponseDTO);
    });
});