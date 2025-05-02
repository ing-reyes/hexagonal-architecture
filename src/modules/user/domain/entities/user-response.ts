import { UserRole } from "../../../../shared/enums";

export class UserResponseDTO {
    public id: string;
    public name: string;
    public email: string;
    public roles: UserRole[];
    public createdAt: Date;
    public updatedAt: Date;
    
    constructor(
        id: string,
        name: string,
        email: string,
        roles: UserRole[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}