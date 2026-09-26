import { describe, expect, test } from "bun:test";
import { sanitizeRichText } from "../../src/utils/sanitize";

describe("sanitize", () => {
  test("removes dangerous HTML", () => {
    const dangerousHTML = "<script>alert(1)</script><img src=x onerror=alert(1)><a href=\"javascript:alert(1)\">test</a>";
    const sanitized = sanitizeRichText(dangerousHTML);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("onerror");
    expect(sanitized).not.toContain("javascript:");
  });
  test("preserves legitimate formatting and safe links", () => {
    const legitimateHTML = "<h2>Heading</h2><p><strong>Bold</strong> text</p><ul><li>Item</li></ul><a href=\"https://example.com\">Link</a>";
    const sanitized = sanitizeRichText(legitimateHTML);
    expect(sanitized).toContain("<h2>Heading</h2>");
    expect(sanitized).toContain("<strong>Bold</strong>");
    expect(sanitized).toContain("<ul><li>Item</li></ul>");
    // Check if the link is preserved with href attribute
    expect(sanitized).toContain("<a href=\"https://example.com\">Link</a>");
    expect(sanitized).not.toContain("javascript:");
  });
});