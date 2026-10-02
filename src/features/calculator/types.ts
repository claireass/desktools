export type Operator = "+" | "-" | "*" | "/";

export type CalculatorError = "divide-by-zero";

export type CalculatorState = {
  display: string;
  stored: number | null;
  operator: Operator | null;
  fresh: boolean;
  error: CalculatorError | null;
};
