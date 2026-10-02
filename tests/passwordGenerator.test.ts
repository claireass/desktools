import { describe, expect, it } from "vitest";
import {
  generatePassword,
  passwordEntropyBits,
} from "@/features/password-generator/logic";

const options = {
  length: 12,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: true,
};

describe("password generator", () => {
  it("uses every selected set and skips ambiguous characters", () => {
    const password = generatePassword(options);
    expect(password).toMatch(/^[^\s]{12}$/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[^A-Za-z0-9]/);
    expect(password).not.toMatch(/[0Ool1I]/);
  });

  it("repeats the same bytes as the same password", () => {
    const random = () => new Uint8Array(32).fill(0);
    expect(generatePassword(options, random)).toBe(generatePassword(options, random));
  });

  it("rejects a short length and reports entropy in bits", () => {
    expect(generatePassword({ ...options, length: 4 })).toBeNull();
    expect(passwordEntropyBits(20, 70)).toBe(Math.floor(20 * Math.log2(70)));
  });
});
