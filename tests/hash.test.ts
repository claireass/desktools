import { describe, expect, it } from "vitest";
import { hashText } from "@/features/hash-generator/logic";

describe("hashText", () => {
  it("matches known digests", async () => {
    expect(await hashText("", "md5")).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(await hashText("abc", "md5")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(await hashText("message digest", "md5")).toBe(
      "f96b697d7cb7938d525a2f31aaf161d0",
    );
    expect(await hashText("hello", "sha1")).toBe(
      "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
    );
    expect(await hashText("abc", "sha256")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(await hashText("abc", "sha512")).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    );
  });
});
