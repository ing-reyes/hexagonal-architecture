import { UpdateUserUseCase } from "../../../../../src/modules/user/application/use-cases";
import { HttpStatus } from "../../../../../src/shared/enums";
import { ApiOneResponse, UserResponseDTO } from "../../../../../src/shared/interfaces";




describe("UpdateUserUseCase", () => {
    it("should update a user", async () => {
        // Arrange
        const updateUserDTOMock = {
            name: "Jane Doe",
            email: "JaneDoe@gmail.com",
            password: "123456",
        };
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
                statusMsg: "OK",
                error: null,
            },
            data: {
                id: "6622c8b3e77ef741149c1a7d",
                name: "Jane Doe",
                email: "",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }
        const idMock = "6622c8b3e77ef741149c1a7d";
        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn().mockResolvedValue(userResponseDTOMock),
            remove: jest.fn(),
        };

        // Act
        const result = await userRepositoryMock.update(idMock, updateUserDTOMock);
        const updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
        const executeResult = await updateUserUseCase.execute(idMock, updateUserDTOMock);
        
        // Assert
        expect(userRepositoryMock.update).toHaveBeenCalledWith(idMock, updateUserDTOMock);
        expect(result).toEqual(userResponseDTOMock);
        expect(executeResult).toEqual(userResponseDTOMock);
    });
});
