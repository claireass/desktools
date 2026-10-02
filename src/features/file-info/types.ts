export type FileFactsInput = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

export type FileFacts = {
  name: string;
  extension: string;
  type: string;
  size: number;
  sizeLabel: string;
  lastModified: number;
};
