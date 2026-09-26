import { describe, expect, test } from "bun:test";
import { multerUpload } from "../../src/configs/multerConfig";
describe("File upload validation", () => {
  test("accepts allowed image MIME types", () => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    allowedTypes.forEach(type => {
      const file = { mimetype: type } as Express.Multer.File;
      let isValid = false;
      multerUpload.fileFilter(null, file, (err, valid) => {
        isValid = valid;
      });
      expect(isValid).toBe(true);
    });
  });
  test("rejects disallowed MIME types", () => {
    const disallowedTypes = ["text/plain", "application/pdf"];
    disallowedTypes.forEach(type => {
      const file = { mimetype: type } as Express.Multer.File;
      let isValid = true;
      multerUpload.fileFilter(null, file, (err, valid) => {
        isValid = valid;
      });
      expect(isValid).toBe(false);
    });
  });
});