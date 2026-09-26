import { describe, expect, test, mock, beforeEach } from "bun:test";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// Mock the modules
const mockVerifyJwtToken = mock(async () => null);
const mockFindUnique = mock(async () => null);

mock.module("../../src/utils/jwt", () => ({
  verifyJwtToken: mockVerifyJwtToken,
}));

mock.module("../../src/configs/db", () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}));

mock.module("../../src/configs/envVars", () => ({
  envVars: {
    JWT_ACCESS_SECRET: "test-secret",
  },
}));

// Now import the module under test
import authCheck from "../../src/middlewares/authCheck";
import AppError from "../../src/errorHelper/error";

describe("authCheck middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: "valid-token",
      },
      cookies: {},
    };
    mockRes = {};
    mockNext = mock(() => {});
    mockVerifyJwtToken.mockReset();
    mockFindUnique.mockReset();
  });

  test("allows access for valid token and authorized role", async () => {
    mockVerifyJwtToken.mockResolvedValue({ email: "test@example.com", role: "ADMIN" });
    mockFindUnique.mockResolvedValue({
      email: "test@example.com",
      role: "ADMIN",
      isActive: "ACTIVE",
      isVerified: true,
    } as any);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect((mockReq as any).user).toEqual({ email: "test@example.com", role: "ADMIN" });
  });

  test("throws error if token is missing", async () => {
    mockReq.headers!.authorization = undefined;

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.message).toBe("Authentication required");
  });

  test("throws error if token is invalid", async () => {
    mockVerifyJwtToken.mockResolvedValue(null);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.message).toBe("Invalid access token");
  });

  test("throws error if user not found", async () => {
    mockVerifyJwtToken.mockResolvedValue({ email: "test@example.com", role: "ADMIN" });
    mockFindUnique.mockResolvedValue(null);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(error.message).toBe("You are not authorized owner");
  });

  test("throws error if user is blocked or inactive", async () => {
    mockVerifyJwtToken.mockResolvedValue({ email: "test@example.com", role: "ADMIN" });
    mockFindUnique.mockResolvedValue({
      email: "test@example.com",
      role: "ADMIN",
      isActive: "BLOCKED",
      isVerified: true,
    } as any);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.message).toContain("BLOCKED");
  });

  test("throws error if user is not verified", async () => {
    mockVerifyJwtToken.mockResolvedValue({ email: "test@example.com", role: "ADMIN" });
    mockFindUnique.mockResolvedValue({
      email: "test@example.com",
      role: "ADMIN",
      isActive: "ACTIVE",
      isVerified: false,
    } as any);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toBe("You are not verified");
  });

  test("throws error if role is not authorized", async () => {
    mockVerifyJwtToken.mockResolvedValue({ email: "test@example.com", role: "ADMIN" });
    mockFindUnique.mockResolvedValue({
      email: "test@example.com",
      role: "USER",
      isActive: "ACTIVE",
      isVerified: true,
    } as any);

    const middleware = authCheck("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.message).toBe("Authorization required to access");
  });
});