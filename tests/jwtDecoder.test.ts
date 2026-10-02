import { describe, expect, it } from "vitest";
import { decodeJwt } from "@/features/jwt-decoder/logic";

const token = [
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0",
  "eyJzdWIiOiJkZXNrIiwiZXhwIjowfQ",
  "sig",
].join(".");

describe("jwt decoder", () => {
  it("reads the header, payload, and expiry without checking the signature", () => {
    expect(decodeJwt(token)).toEqual({
      header: '{\n  "alg": "none",\n  "typ": "JWT"\n}',
      payload: '{\n  "sub": "desk",\n  "exp": 0\n}',
      signature: "sig",
      unsafeAlgorithm: true,
      claims: {
        exp: "1970-01-01T00:00:00.000Z",
        nbf: null,
        iat: null,
      },
    });
  });

  it("rejects a token that is not three json parts", () => {
    expect(decodeJwt("a.b")).toBeNull();
    expect(decodeJwt("a.b.c")).toBeNull();
  });
});
