import 'dotenv/config';
import { config } from 'dotenv';
config({
    path: `.env.${ process.env.NODE_ENV ?? 'development' }`,
})
import { get } from 'env-var'
export const envs = {
    PORT: get('PORT').required().asPortNumber(),

    MONGO_DB_USERNAME: get('MONGO_DB_USERNAME').required().asString(),
    MONGO_DB_PASSWORD: get('MONGO_DB_PASSWORD').required().asString(),
    MONGO_DB_URL: get('MONGO_DB_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

    JWT_SECRET: get('JWT_SECRET').required().asString(),
    JWT_EXPIRES_IN: get('JWT_EXPIRES_IN').required().asString(),
}