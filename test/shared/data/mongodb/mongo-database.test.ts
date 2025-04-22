import { MongoDB } from '../../../../src/shared/data/mongodb/mongo-database';
import mongoose from 'mongoose';

jest.mock("mongoose", () => ({
    connect: jest.fn(),
}));

describe("MongoDB", () => {
    let mongoDB: MongoDB;

    beforeEach(() => {
        jest.clearAllMocks();
        mongoDB = new MongoDB();
    });
    it("should connect to MongoDB successfully", async () => {
        // Arrange
        const mongoUrlMock = "mongodb://localhost:27017/testdb";
        const dbNameMock = "testdb";

        (mongoose.connect as jest.Mock).mockResolvedValueOnce(true);

        // Act
        const result = await mongoDB.connect({ mongoUrl: mongoUrlMock, dbName: dbNameMock });

        // Assert
        expect(mongoose.connect).toHaveBeenCalledWith(mongoUrlMock, { dbName: dbNameMock });
        expect(result).toBe(true);
    });

    it("should handle connection errors", async () => {
        // Arrange
        const mongoUrlMock = "mongodb://localhost:27017/testdb";
        const dbNameMock = "testdb";
        const errorMock = new Error("Connection failed");

        (mongoose.connect as jest.Mock).mockRejectedValueOnce(errorMock);

        // Mock process.exit to prevent the test from exiting
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("Process exited");
        });

        // Act & Assert
        await expect(mongoDB.connect({ mongoUrl: mongoUrlMock, dbName: dbNameMock })).rejects.toThrow(
            "Process exited"
        );
        expect(mongoose.connect).toHaveBeenCalledWith(mongoUrlMock, { dbName: dbNameMock });
        expect(processExitSpy).toHaveBeenCalledWith(1);

        // Restore process.exit
        processExitSpy.mockRestore();
    });
});