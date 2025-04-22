import { JwtConfig, VerifyToken } from '../../../src/shared/config/jwt.config';
import { UserRole } from '../../../src/shared/enums';
describe("JwtConfig", ()=>{
    it("should generate a token", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER] };
        const token = await jwtConfig.generateToken(payload);
        expect(token).toBeDefined();
    });

    it("should verify a token", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER], iat: 1234567890, exp: 1234567890 };
        const token = await jwtConfig.generateToken(payload);
        const verifiedPayload = await jwtConfig.verifyToken<VerifyToken>(token as string);
        expect(verifiedPayload).toBeDefined();
    });

    it("should refresh a token", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER] };
        const token = await jwtConfig.generateToken(payload);
        const refreshedToken = await jwtConfig.refresshToken(token as string);
        expect(refreshedToken).toBeDefined();
    });

    it("should refresh token return null", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER] };
        const token = await jwtConfig.generateToken(payload);
        const refreshedToken = await jwtConfig.refresshToken(`${token}a` as string);
        expect(refreshedToken).toBe(null);
    });

    it("should check if a token is expired", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER] };
        const token = await jwtConfig.generateToken(payload);
        const isExpired = await jwtConfig.verifyTokenExpired(token as string);
        expect(isExpired).toBe(false);
    });

    it("should return null the token expiration check", async () => {
        const jwtConfig = new JwtConfig();
        const payload = { id: "123", roles: [UserRole.USER] };
        const token = await jwtConfig.generateToken(payload);
        const isExpired = await jwtConfig.verifyTokenExpired(`${token}a` as string);
        expect(isExpired).toBe(false);
    });
});