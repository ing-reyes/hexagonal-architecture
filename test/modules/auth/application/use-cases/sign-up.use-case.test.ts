import { SignUpUseCase } from "../../../../../src/modules/auth/application/use-cases";
import { AuthResponseDTO, SignUpDTO } from "../../../../../src/modules/auth/domain/entities";
import { HttpStatus, UserRole } from "../../../../../src/shared/enums";
import { ApiOneResponse } from "../../../../../src/shared/interfaces";

describe("SignUpUseCase", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should sign up a user", async () => {
        // Arrange
        const idMock = "6801efbf2ef483fa4668cb1d";
        const signUpDTOMock: SignUpDTO = {
            name: 'name1',
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
                    ...signUpDTOMock,
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
            signUp: jest.fn().mockResolvedValue(authResponseDTO),
            refreshToken: jest.fn(),
        }

        const useCase = new SignUpUseCase(authRepositoryMock);

        // Act
        jest.spyOn(useCase, 'execute');
        const result = await useCase.execute(signUpDTOMock);

        // Assert
        expect(await useCase.execute).toHaveBeenCalledWith(signUpDTOMock);
        expect(result).toEqual(authResponseDTO);
    });
});