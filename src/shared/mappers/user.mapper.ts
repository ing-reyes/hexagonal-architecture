import { UserRole } from "../enums";
import { ManagerError } from "../errors";


export class UserMapper {
    private constructor(
        public id: string,
        public name: string,
        public email: string,
        public roles: UserRole[],
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
    static modelUserToEntity(object: { [key: string]: any }): UserMapper {
        const { id, _id, name, email, roles, createdAt, updatedAt } = object;

        if (typeof id !== 'string' && typeof _id !== 'string') throw ManagerError.badRequest('Invalid ID');
        if (typeof name !== 'string') throw ManagerError.badRequest('Invalid name');
        if (!Array.isArray(roles)) throw ManagerError.badRequest('Invalid roles');

        return new UserMapper(id ?? _id, name, email, roles, createdAt, updatedAt)
    }
}