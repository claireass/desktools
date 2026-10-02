export type RenameProblem = "empty" | "invalid" | "reserved" | "duplicate" | "tooLong";

export type RenameOptions = {
  template: string;
  start: number;
  pad: number;
};

export type RenameRow = {
  original: string;
  next: string;
  problem: RenameProblem | null;
};
