import { envs } from '../../../src/shared/config/envs.config';
import 'dotenv/config';

describe("envs", ()=>{
    it("should load env variables", () => {
        process.env.NODE_ENV = 'development'
        expect(envs).toBeDefined()
        expect(envs.PORT).toBe(+process.env.PORT!)
        expect(envs.MONGO_DB_USERNAME).toBe(process.env.MONGO_DB_USERNAME)
        expect(envs.MONGO_DB_PASSWORD).toBe(process.env.MONGO_DB_PASSWORD)
        expect(envs.MONGO_DB_URL).toBe(process.env.MONGO_DB_URL)
        expect(envs.MONGO_DB_NAME).toBe(process.env.MONGO_DB_NAME)
        expect(envs.JWT_SECRET).toBe(process.env.JWT_SECRET)
        expect(envs.JWT_EXPIRES_IN).toBe(process.env.JWT_EXPIRES_IN)
    })
});