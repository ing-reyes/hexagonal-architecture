import { UserRole } from "../enums";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    roles: UserRole[];
    createdAt: Date;
    updatedAt: Date;
}