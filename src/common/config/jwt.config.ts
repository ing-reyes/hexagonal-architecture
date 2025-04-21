import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../../domain/enums';
import { envs } from './envs.config';

const JWT_SECRET = envs.JWT_SECRET;
const JWT_EXPIRATION = envs.JWT_EXPIRES_IN;

export type VerifyToken = {
    id: string, 
    roles: UserRole[], 
    iat: number, 
    exp: number,
}

export class JwtConfig {
    // Generate a JWT token with a payload and an expiration time
    async generateToken(payload: Object, duration: string|number = JWT_EXPIRATION): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: duration } as SignOptions, (error, token) => {
                if (error) return resolve(null);

                return resolve(token as string);
            });
        });
    }

    // Verify a JWT token and return the decoded payload
    async verifyToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (error, decoded) => {
                if (error) return resolve(null);

                return resolve(decoded as T);
            });
        });
    }

    // Refresh a JWT token by verifying the old one and generating a new one
    async refresshToken(token: string): Promise<string | null> {
        const payload = await this.verifyToken<VerifyToken>(token);
        if (!payload) return Promise.resolve(null);

        return this.generateToken({ id: payload.id, roles: payload.roles });
    }

    async verifyTokenExpired(token: string): Promise<boolean> {
        const payload = await this.verifyToken<VerifyToken>(token);
        if (!payload) return false;
    
        // We normalize time units to avoid errors
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        return currentTimeInSeconds >= payload.exp;
    }
}