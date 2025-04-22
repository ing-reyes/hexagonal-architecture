import { UserRole } from '../../../../../../../src/shared/enums/user.role.enum';
import { AuthMapper } from '../../../../../../../src/modules/auth/infraestructure/adapters/drivens/database/mongo/auth.mapper';
import { ManagerError } from '../../../../../../../src/shared/errors';

describe("AuthMapper", () => {
    const mockedUser = {
        id: "64b7f9f4f4d3a2e8c4a7b9c1",
        name: "John Doe",
        email: "John@gmail.com",
        password: "hashedpassword",
        roles: [UserRole.USER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    const mockedTokens = {
        accessToken: "accessToken",
        refreshToken: 'refreshToken',
        expiresIn: 3600,
    }
    const mockedUserWithTokensResponse = {
        user: {
            id: mockedUser.id.toString(),
            name: mockedUser.name,
            email: mockedUser.email,
            roles: mockedUser.roles,
            createdAt: mockedUser.createdAt,
            updatedAt: mockedUser.updatedAt,
        },
        tokens: {
            accessToken: mockedTokens.accessToken,
            refreshToken: mockedTokens.refreshToken,
            expiresIn: mockedTokens.expiresIn
        }
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should be defined", () => {
        expect(AuthMapper.modelUserToEntity({ user: mockedUser, tokens: mockedTokens })).toEqual(mockedUserWithTokensResponse);
    });

    it("should throw invalid id", () => {
        const mockedUser = {
            id: new Date().getTime(), // Invalid ID type
            name: "John Doe",
            email: "John@gmail.com",
            password: "hashedpassword",
            roles: [UserRole.USER],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const mockedTokens = {
            accessToken: "accessToken",
            refreshToken: 'refreshToken',
            expiresIn: 3600,
        }

        // Act & Assert
        expect(() => AuthMapper.modelUserToEntity({ user: mockedUser, tokens: mockedTokens })).toThrow(
            ManagerError.badRequest("Invalid ID")
        );
    });

    it("should throw invalid name", () => {
        const mockedUser = {
            id: "64b7f9f4f4d3a2e8c4a7b9c1",
            name: new Date().getTime(), // Invalid name type
            email: "John@gmail.com",
            password: "hashedpassword",
            roles: [UserRole.USER],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const mockedTokens = {
            accessToken: "accessToken",
            refreshToken: 'refreshToken',
            expiresIn: 3600,
        }

        // Act & Assert
        expect(() => AuthMapper.modelUserToEntity({ user: mockedUser, tokens: mockedTokens })).toThrow(
            ManagerError.badRequest("Invalid name")
        );
    });

    it("should throw invalid name", () => {
        const mockedUser = {
            id: "64b7f9f4f4d3a2e8c4a7b9c1",
            name: 'John Doe', 
            email: "John@gmail.com",
            password: "hashedpassword",
            roles: UserRole.USER, // Invalid role type
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const mockedTokens = {
            accessToken: "accessToken",
            refreshToken: 'refreshToken',
            expiresIn: 3600,
        }

        // Act & Assert
        expect(() => AuthMapper.modelUserToEntity({ user: mockedUser, tokens: mockedTokens })).toThrow(
            ManagerError.badRequest("Invalid roles")
        );
    });
});