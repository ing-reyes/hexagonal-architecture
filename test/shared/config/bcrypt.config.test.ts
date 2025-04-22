import { BcryptAdapter } from '../../../src/shared/config/bcrypt.config';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
    genSalt: jest.fn(),
}));

describe("BcryptAdapter", ()=>{

    it("should hash a password", async () => {
        const bcryptAdapter = new BcryptAdapter();
        const password = "password";
        const hashedPassword = "hashedPassword";

        // Mock bcrypt.hash
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        // Mock bcrypt.genSalt
        (bcrypt.genSalt as jest.Mock).mockResolvedValue(10);

        const hash = await bcryptAdapter.hash(password);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10); // Assuming 10 is the default salt rounds
        expect(hash).toBe(hashedPassword);
    });

    it("should compare a password with a hash", async () => {
        const bcryptAdapter = new BcryptAdapter();
        const password = "password";
        const hash = "hashedPassword";

        // Mock bcrypt.compare
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const isMatch = await bcryptAdapter.compare(password, hash);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
        expect(isMatch).toBe(true);
    });
});