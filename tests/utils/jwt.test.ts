import { describe, expect, test } from "bun:test";
import { generateAccessToken, verifyJwtToken } from "../../src/utils/jwt";
describe("JWT utilities", () => {
  const testSecret = "test-secret";
  const testPayload = { email: "test@example.com" };
  const expires = "1h";
  test("generates and verifies valid token", async () => {
    const token = await generateAccessToken(testPayload, testSecret, expires);
    const decoded = await verifyJwtToken(token, testSecret);
    expect(decoded.email).toBe(testPayload.email);
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
});