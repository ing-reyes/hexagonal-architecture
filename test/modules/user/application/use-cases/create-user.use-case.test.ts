import { CreateUserUseCase } from "../../../../../src/modules/user/application/use-cases";
import { UserResponseDTO } from "../../../../../src/modules/user/domain/entities";
import { HttpStatus } from "../../../../../src/shared/enums";
import { ApiOneResponse } from "../../../../../src/shared/interfaces";


describe("CreateUserUseCase", () => {
    it("should create a user", async () => {
        // Arrange
        const createUserDTOMock = {
            name: "John Doe",
            email: "JohnDoe@gmail.com",
            password: "JohnDoe@gmail.com",
        };
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.CREATED,
                statusMsg: "CREATED",
                error: null,
            },
            data: {
                id: "6622c8b3e77ef741149c1a7d",
                name: "John Doe",
                email: "",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
        const userRepositoryMock = {
            create: jest.fn().mockResolvedValue(userResponseDTOMock),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        const createUserUseCase = new CreateUserUseCase(userRepositoryMock);

        // Act
        const result = await createUserUseCase.execute(createUserDTOMock);
        const executeResult = await createUserUseCase.execute(createUserDTOMock);
        
        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDTOMock);
        expect(executeResult).toEqual(userResponseDTOMock);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDTOMock);
    });
});
