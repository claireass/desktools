export const hashAlgorithms = ["md5", "sha1", "sha256", "sha512"] as const;

export type HashAlgorithm = (typeof hashAlgorithms)[number];
