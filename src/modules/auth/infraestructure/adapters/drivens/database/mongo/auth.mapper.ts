import { ManagerError } from "../../../../../../../shared/errors";
import { AuthToken, UserAuth } from "../../../../../domain/entities";

export class AuthMapper {
    constructor(
        public user: UserAuth,
        public tokens: AuthToken,
    ) { }

    static modelUserToEntity(object: { [key: string]: any }): AuthMapper {
        const { user, tokens } = object;

        const { id, name, email, roles, createdAt, updatedAt } = user;
        const { accessToken, refreshToken, expiresIn } = tokens;

        if (typeof id !== 'string') throw ManagerError.badRequest('Invalid ID');
        if (typeof name !== 'string') throw ManagerError.badRequest('Invalid name');
        if (!Array.isArray(roles)) throw ManagerError.badRequest('Invalid roles');

        return new AuthMapper({ id, name, email, roles, createdAt, updatedAt }, { accessToken, refreshToken, expiresIn });
    }
}