import { UserRole } from "../../../../shared/enums";

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        email: string,
        password: string,
        roles: UserRole[],
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}