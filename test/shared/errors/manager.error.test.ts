import { ManagerError } from "../../../src/shared/errors";

describe("ManagerError", ()=>{
    it("should create a ManagerError with a message and status code", () => {
        const error = new ManagerError(400, "Invalid input data", "BAD_REQUEST");
        expect(error).toBeInstanceOf(ManagerError);
        expect(error.statusCode).toBe(400);
        expect(error.statusMsg).toBe("BAD_REQUEST");
        expect(error.message).toBe("Invalid input data");
    });

    const testCases = [
        // 100 Series
        { method: "continue", statusCode: 100, statusMsg: "CONTINUE", message: "Continue processing" },
        { method: "switchingProtocols", statusCode: 101, statusMsg: "SWITCHING_PROTOCOLS", message: "Switching protocols" },
        { method: "processing", statusCode: 102, statusMsg: "PROCESSING", message: "Processing request" },
        { method: "earlyhints", statusCode: 103, statusMsg: "EARLYHINTS", message: "Early hints" },

        // 200 Series
        { method: "ok", statusCode: 200, statusMsg: "OK", message: "Operation successful" },
        { method: "created", statusCode: 201, statusMsg: "CREATED", message: "Resource created" },
        { method: "accepted", statusCode: 202, statusMsg: "ACCEPTED", message: "Request accepted" },
        { method: "nonAuthoritativeInformation", statusCode: 203, statusMsg: "NON_AUTHORITATIVE_INFORMATION", message: "Non-authoritative information" },
        { method: "noContent", statusCode: 204, statusMsg: "NO_CONTENT", message: "No content" },
        { method: "resetContent", statusCode: 205, statusMsg: "RESET_CONTENT", message: "Reset content" },
        { method: "partialContent", statusCode: 206, statusMsg: "PARTIAL_CONTENT", message: "Partial content" },

        // 300 Series
        { method: "ambiguous", statusCode: 300, statusMsg: "AMBIGUOUS", message: "Ambiguous request" },
        { method: "movedPermanently", statusCode: 301, statusMsg: "MOVED_PERMANENTLY", message: "Moved permanently" },
        { method: "found", statusCode: 302, statusMsg: "FOUND", message: "Resource found" },
        { method: "seeOther", statusCode: 303, statusMsg: "SEE_OTHER", message: "See other resource" },
        { method: "notModified", statusCode: 304, statusMsg: "NOT_MODIFIED", message: "Resource not modified" },
        { method: "temporaryRedirect", statusCode: 307, statusMsg: "TEMPORARY_REDIRECT", message: "Temporary redirect" },
        { method: "permanentRedirect", statusCode: 308, statusMsg: "PERMANENT_REDIRECT", message: "Permanent redirect" },

        // 400 Series
        { method: "badRequest", statusCode: 400, statusMsg: "BAD_REQUEST", message: "Bad request" },
        { method: "unauthorized", statusCode: 401, statusMsg: "UNAUTHORIZED", message: "Unauthorized access" },
        { method: "paymentRequired", statusCode: 402, statusMsg: "PAYMENT_REQUIRED", message: "Payment required" },
        { method: "forbiden", statusCode: 403, statusMsg: "FORBIDDEN", message: "Access forbidden" },
        { method: "notFound", statusCode: 404, statusMsg: "NOT_FOUND", message: "Resource not found" },
        { method: "methodNotAllowed", statusCode: 405, statusMsg: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
        { method: "notAcceptable", statusCode: 406, statusMsg: "NOT_ACCEPTABLE", message: "Not acceptable" },
        { method: "proxyAuthenticationRequired", statusCode: 407, statusMsg: "PROXY_AUTHENTICATION_REQUIRED", message: "Proxy authentication required" },
        { method: "requestTimeout", statusCode: 408, statusMsg: "REQUEST_TIMEOUT", message: "Request timeout" },
        { method: "conflict", statusCode: 409, statusMsg: "CONFLICT", message: "Conflict detected" },
        { method: "gone", statusCode: 410, statusMsg: "GONE", message: "Resource gone" },
        { method: "lengthRequired", statusCode: 411, statusMsg: "LENGTH_REQUIRED", message: "Length required" },
        { method: "preconditionFailed", statusCode: 412, statusMsg: "PRECONDITION_FAILED", message: "Precondition failed" },
        { method: "payloadTooLarge", statusCode: 413, statusMsg: "PAYLOAD_TOO_LARGE", message: "Payload too large" },
        { method: "uriTooLong", statusCode: 414, statusMsg: "URI_TOO_LONG", message: "URI too long" },
        { method: "unsupportedMediaType", statusCode: 415, statusMsg: "UNSUPPORTED_MEDIA_TYPE", message: "Unsupported media type" },
        { method: "requestedRangeNotSatisfiable", statusCode: 416, statusMsg: "REQUESTED_RANGE_NOT_SATISFIABLE", message: "Requested range not satisfiable" },
        { method: "expectationFailed", statusCode: 417, statusMsg: "EXPECTATION_FAILED", message: "Expectation failed" },
        { method: "iAmATeapot", statusCode: 418, statusMsg: "I_AM_A_TEAPOT", message: "I'm a teapot" },
        { method: "misdirected", statusCode: 421, statusMsg: "MISDIRECTED", message: "Misdirected request" },
        { method: "unprocessableEntity", statusCode: 422, statusMsg: "UNPROCESSABLE_ENTITY", message: "Unprocessable entity" },
        { method: "failedDependency", statusCode: 424, statusMsg: "FAILED_DEPENDENCY", message: "Failed dependency" },
        { method: "preconditionRequired", statusCode: 428, statusMsg: "PRECONDITION_REQUIRED", message: "Precondition required" },
        { method: "tooManyRequests", statusCode: 429, statusMsg: "TOO_MANY_REQUESTS", message: "Too many requests" },

        // 500 Series
        { method: "internalServerError", statusCode: 500, statusMsg: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
        { method: "notImplemented", statusCode: 501, statusMsg: "NOT_IMPLEMENTED", message: "Not implemented" },
        { method: "badGateway", statusCode: 502, statusMsg: "BAD_GATEWAY", message: "Bad gateway" },
        { method: "serviceUnavailable", statusCode: 503, statusMsg: "SERVICE_UNAVAILABLE", message: "Service unavailable" },
        { method: "gatewayTimeout", statusCode: 504, statusMsg: "GATEWAY_TIMEOUT", message: "Gateway timeout" },
        { method: "httpVersionNotSupported", statusCode: 505, statusMsg: "HTTP_VERSION_NOT_SUPPORTED", message: "HTTP version not supported" },
    ];

    testCases.forEach(({ method, statusCode, statusMsg, message }) => {
        it(`should call the static ${method} method`, () => {
            const error = (ManagerError as any)[method](message);
            expect(error).toBeInstanceOf(ManagerError);
            expect(error.statusCode).toBe(statusCode);
            expect(error.statusMsg).toBe(statusMsg);
            expect(error.message).toBe(message);
        });
    });
});