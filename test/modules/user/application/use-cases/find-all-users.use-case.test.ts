import { FindAllUsersUseCase } from "../../../../../src/modules/user/application/use-cases";
import { UserResponseDTO } from "../../../../../src/modules/user/domain/entities";
import { HttpStatus, UserRole } from "../../../../../src/shared/enums";
import { ApiOneResponse } from "../../../../../src/shared/interfaces";




describe("FindAllUsersUseCase", () => {

    it("should find all users", async () => {
        // Arrange
        const idMock = "6622c8b3e77ef741149c1a7d";
        const paginationDTOMock = {
            page: 1,
            limit: 10,
        }
        const userResponseMock: ApiOneResponse<UserResponseDTO> = {
            status: {
                statusCode: HttpStatus.OK,
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
        }
        const userRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(userResponseMock),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        // Act
        const result = await userRepositoryMock.findAll(paginationDTOMock);
        const findAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMock);
        // Act
        const executeResult = await findAllUsersUseCase.execute(paginationDTOMock);

        // Assert
        expect(result).toEqual(userResponseMock);
        expect(executeResult).toEqual(userResponseMock);
    });
});
