import { describe, expect, it } from "vitest";
import {
  chooseOperator,
  evaluate,
  initialCalculator,
  inputDecimal,
  inputDigit,
} from "@/features/calculator/logic";
import type { CalculatorState, Operator } from "@/features/calculator/types";

function press(digits: string, operator?: Operator, more?: string): CalculatorState {
  let state = digits
    .split("")
    .reduce((current, digit) => inputDigit(current, digit), initialCalculator());
  if (operator) {
    state = chooseOperator(state, operator);
  }
  if (more) {
    state = more.split("").reduce((current, digit) => inputDigit(current, digit), state);
  }
  return state;
}

describe("calculator", () => {
  it("adds, chains, and rounds binary floating point", () => {
    expect(evaluate(press("2", "+", "3")).display).toBe("5");
    const chained = chooseOperator(press("1", "+", "2"), "+");
    expect(chained.display).toBe("3");
    expect(evaluate(inputDigit(chained, "3")).display).toBe("6");

    let state = inputDecimal(inputDigit(initialCalculator(), "0"));
    state = inputDigit(state, "1");
    state = chooseOperator(state, "+");
    state = inputDecimal(inputDigit(state, "0"));
    state = inputDigit(state, "2");
    expect(evaluate(state).display).toBe("0.3");
  });

  it("subtracts, multiplies, and divides", () => {
    expect(evaluate(press("8", "-", "3")).display).toBe("5");
    expect(evaluate(press("6", "*", "7")).display).toBe("42");
    expect(evaluate(press("8", "/", "2")).display).toBe("4");
  });

  it("reports division by zero and keeps the previous display", () => {
    const state = evaluate(press("8", "/", "0"));
    expect(state.error).toBe("divide-by-zero");
    expect(state.display).toBe("0");
    expect(inputDigit(state, "1")).toBe(state);
  });
});
