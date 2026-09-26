import { describe, expect, test } from "bun:test";
import { generateAccessToken, verifyJwtToken } from "../../src/utils/jwt";
import jwt from "jsonwebtoken";

describe("JWT utilities", () => {
  const testSecret = "test-secret";
  const testPayload = { email: "test@example.com", role: "ADMIN" };
  const expires = "1h";

  test("generates and verifies valid token", async () => {
    const token = await generateAccessToken(testPayload, testSecret, expires);
    const decoded = (await verifyJwtToken(token, testSecret)) as any;
    expect(decoded.email).toBe(testPayload.email);
    expect(decoded.role).toBe(testPayload.role);
  });

  test("rejects invalid token", async () => {
    const invalidToken = "invalid.token.here";
    try {
      await verifyJwtToken(invalidToken, testSecret);
      expect(false).toBe(true, "Expected error was not thrown");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("rejects malformed token", async () => {
    const malformedToken = "not.a.valid.token";
    try {
      await verifyJwtToken(malformedToken, testSecret);
      expect(false).toBe(true, "Expected error was not thrown");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("rejects token with wrong secret", async () => {
    const token = await generateAccessToken(testPayload, testSecret, expires);
    try {
      await verifyJwtToken(token, "wrong-secret");
      expect(false).toBe(true, "Expected error was not thrown");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("rejects expired token", async () => {
    // Generate a token that expires in 0 seconds
    const token = jwt.sign(testPayload, testSecret, { expiresIn: '0s' });
    try {
      await verifyJwtToken(token, testSecret);
      expect(false).toBe(true, "Expected error was not thrown");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});