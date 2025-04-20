import { UserResponseDTO } from "../../../../src/domain/entities";
import { UserRole } from "../../../../src/domain/enums";
import { ApiOneResponse } from "../../../../src/domain/interfaces";
import { FindOneUserByIdUseCase } from '../../../../src/application/use-cases/user/find-one-user-by-id.use-case';


describe("FindOneUserByIdUserUseCase", () => {

    it("should find a user by ID", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d";
        const userResponseMock: ApiOneResponse<UserResponseDTO | null> = {
            status: {
                statusCode: 200,
                statusMsg: "OK",
                error: null,
            },
            data: {
                id: idMock,
                name: "John Doe",
                email: "",
                roles: [UserRole.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn().mockResolvedValue(userResponseMock),
            update: jest.fn(),
            remove: jest.fn(),
        };

        // Act
        const result = await userRepositoryMock.findOneById(idMock);
        const findOneUserByIdUseCase = new FindOneUserByIdUseCase(userRepositoryMock);
        const executeResult = await findOneUserByIdUseCase.execute(idMock);

        // Assert
        expect(result).toEqual(userResponseMock);
        expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(idMock);
        expect(executeResult).toEqual(userResponseMock);
    });
});
