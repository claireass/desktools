export type SizeInput = {
  name: string;
  size: number;
};

export type SizeItem = {
  name: string;
  size: number;
  sizeLabel: string;
};

export type SizeReport = {
  count: number;
  total: number;
  totalLabel: string;
  largest: SizeItem | null;
  items: SizeItem[];
};
