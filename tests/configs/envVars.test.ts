import { describe, expect, test } from "bun:test";
import { envVars } from "../../src/configs/envVars";

describe("Environment configuration", () => {
  test("envVars exports a valid object with valid configuration", () => {
    expect(envVars).toBeDefined();
    expect(envVars.PORT).toBeDefined();
    expect(typeof envVars.PORT).toBe("number");
    expect(envVars.NODE_ENV).toBeDefined();
    expect(envVars.DATABASE_URL).toBeDefined();
    expect(envVars.FRONTEND_URL).toBeDefined();
  });
});