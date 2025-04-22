import { Response } from "express";
import { Handler, ManagerError } from "../../../src/shared/errors";

describe("Handler", ()=>{
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle ManagerError", () => {
        const error = new ManagerError(400, "Invalid input data", "BAD_REQUEST");
        const handler = new Handler();
        handler.error(error, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ statusCode: 400, statusMsg: "BAD_REQUEST", error: "Invalid input data" });
    });

    it("should handle generic Error", () => {
        const error = new Error("Something went wrong");
        const handler = new Handler();
        handler.error(error, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ statusCode: 500, statusMsg: "INTERNAL_SERVER_ERROR", error: "Something went wrong" });
    });
});