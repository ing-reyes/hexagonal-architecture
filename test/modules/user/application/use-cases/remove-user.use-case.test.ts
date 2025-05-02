import { RemoveUserUseCase } from "../../../../../src/modules/user/application/use-cases";
import { UserResponseDTO } from "../../../../../src/modules/user/domain/entities";
import { ApiOneResponse } from "../../../../../src/shared/interfaces";



describe("RemoveUserUseCase", () => {

    it("should remove a user", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d";
        const userResponseDTOMock: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: 200,
                statusMsg: "OK",
                error: null,
            },
            data: {
                id: idMock,
                name: "John Doe",
                email: "",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn().mockResolvedValue(userResponseDTOMock),
        };

        // Act
        const result = await userRepositoryMock.remove(idMock);
        const removeUserUseCase = new RemoveUserUseCase(userRepositoryMock);
        const executeResult = await removeUserUseCase.execute(idMock);

        // Assert
        expect(result).toEqual(userResponseDTOMock);
        expect(userRepositoryMock.remove).toHaveBeenCalledWith(idMock);
        expect(executeResult).toEqual(userResponseDTOMock);
    });
});
