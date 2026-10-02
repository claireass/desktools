import type { CalculatorState, Operator } from "@/features/calculator/types";

const MAX_DIGITS = 12;

export function initialCalculator(): CalculatorState {
  return { display: "0", stored: null, operator: null, fresh: true, error: null };
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  const normalized = Object.is(value, -0) ? 0 : value;
  return Number(normalized.toPrecision(12)).toString();
}

export function applyOperator(
  left: number,
  operator: Operator,
  right: number,
): number | "divide-by-zero" {
  if (operator === "/" && right === 0) {
    return "divide-by-zero";
  }
  if (operator === "+") {
    return left + right;
  }
  if (operator === "-") {
    return left - right;
  }
  if (operator === "*") {
    return left * right;
  }
  return left / right;
}

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.error || !/^[0-9]$/.test(digit)) {
    return state;
  }
  if (state.fresh) {
    return { ...state, display: digit, fresh: false };
  }
  const digits = state.display.replace("-", "").replace(".", "");
  if (digits.length >= MAX_DIGITS) {
    return state;
  }
  if (state.display === "0") {
    return { ...state, display: digit };
  }
  if (state.display === "-0") {
    return { ...state, display: `-${digit}` };
  }
  return { ...state, display: `${state.display}${digit}` };
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.error) {
    return state;
  }
  if (state.fresh) {
    return { ...state, display: "0.", fresh: false };
  }
  if (state.display.includes(".")) {
    return state;
  }
  return { ...state, display: `${state.display}.` };
}

export function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error || state.display === "0") {
    return state;
  }
  const display = state.display.startsWith("-")
    ? state.display.slice(1)
    : `-${state.display}`;
  return { ...state, display };
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.error || state.fresh) {
    return state;
  }
  const next = state.display.slice(0, -1);
  if (next === "" || next === "-") {
    return { ...state, display: "0", fresh: true };
  }
  return { ...state, display: next };
}

function compute(state: CalculatorState): CalculatorState | "divide-by-zero" {
  if (state.stored === null || state.operator === null) {
    return state;
  }
  const result = applyOperator(state.stored, state.operator, Number(state.display));
  if (result === "divide-by-zero") {
    return result;
  }
  return {
    display: formatNumber(result),
    stored: result,
    operator: state.operator,
    fresh: true,
    error: null,
  };
}

export function chooseOperator(
  state: CalculatorState,
  operator: Operator,
): CalculatorState {
  if (state.error) {
    return state;
  }
  if (state.stored !== null && state.operator !== null && !state.fresh) {
    const next = compute(state);
    if (next === "divide-by-zero") {
      return { ...state, error: "divide-by-zero" };
    }
    return { ...next, operator };
  }
  return {
    ...state,
    stored: Number(state.display),
    operator,
    fresh: true,
  };
}

export function evaluate(state: CalculatorState): CalculatorState {
  if (state.error || state.stored === null || state.operator === null) {
    return state;
  }
  const next = compute(state);
  if (next === "divide-by-zero") {
    return { ...state, error: "divide-by-zero" };
  }
  return { ...next, stored: null, operator: null };
}
