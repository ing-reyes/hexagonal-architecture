import { UserRole } from "../../../../shared/enums";

export interface AuthToken {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface UserAuth {
    id: string;
    name: string;
    email: string;
    roles: UserRole[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SignInDTO{
    email: string;
    password: string;
}

export interface SignUpDTO{
    name: string;
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    user: UserAuth;
    tokens: AuthToken;
}