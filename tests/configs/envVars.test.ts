import { describe, expect, test } from "bun:test";
import { envVars } from "../../src/configs/envVars";

describe("Environment configuration", () => {
  test("envVars exports a valid object", () => {
    expect(envVars).toBeDefined();
    expect(envVars.NODE_ENV).toBeDefined();
  });
});