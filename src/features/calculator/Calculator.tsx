import { useState } from "react";
import {
  backspace,
  chooseOperator,
  evaluate,
  initialCalculator,
  inputDecimal,
  inputDigit,
  toggleSign,
} from "@/features/calculator/logic";
import type { Operator } from "@/features/calculator/types";
import { useI18n } from "@/hooks/useI18n";

const operators: {
  id: Operator;
  label: string;
  name: "add" | "subtract" | "multiply" | "divide";
}[] = [
  { id: "/", label: "÷", name: "divide" },
  { id: "*", label: "×", name: "multiply" },
  { id: "-", label: "−", name: "subtract" },
  { id: "+", label: "+", name: "add" },
];

export function Calculator() {
  const { t } = useI18n();
  const [state, setState] = useState(initialCalculator);

  return (
    <div
      className="grid w-full max-w-xs gap-3"
      onKeyDown={(event) => {
        if (/^[0-9]$/.test(event.key)) {
          event.preventDefault();
          setState((current) => inputDigit(current, event.key));
        } else if (event.key === ".") {
          event.preventDefault();
          setState((current) => inputDecimal(current));
        } else if (event.key === "Enter" || event.key === "=") {
          event.preventDefault();
          setState((current) => evaluate(current));
        } else if (event.key === "Backspace") {
          event.preventDefault();
          setState((current) => backspace(current));
        } else if (event.key === "Escape") {
          event.preventDefault();
          setState(initialCalculator());
        } else if (
          event.key === "+" ||
          event.key === "-" ||
          event.key === "*" ||
          event.key === "/"
        ) {
          event.preventDefault();
          setState((current) => chooseOperator(current, event.key as Operator));
        }
      }}
    >
      <output
        aria-label={t("tool.calculator.display")}
        className="block rounded-xl border border-border bg-surface px-4 py-5 text-right text-3xl font-semibold tabular-nums"
      >
        {state.display}
      </output>
      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {t("tool.calculator.divideByZero")}
        </p>
      ) : null}
      <div className="grid grid-cols-4 gap-2">
        <CalcButton
          label={t("tool.calculator.clear")}
          onClick={() => setState(initialCalculator())}
        >
          AC
        </CalcButton>
        <CalcButton
          label={t("tool.calculator.backspace")}
          onClick={() => setState((current) => backspace(current))}
        >
          ⌫
        </CalcButton>
        <CalcButton
          label={t("tool.calculator.sign")}
          onClick={() => setState((current) => toggleSign(current))}
        >
          ±
        </CalcButton>
        {operators.slice(0, 1).map((item) => (
          <CalcButton
            key={item.id}
            label={t(`tool.calculator.${item.name}`)}
            active={state.operator === item.id}
            onClick={() => setState((current) => chooseOperator(current, item.id))}
          >
            {item.label}
          </CalcButton>
        ))}
        {["7", "8", "9"].map((digit) => (
          <CalcButton
            key={digit}
            label={digit}
            onClick={() => setState((current) => inputDigit(current, digit))}
          >
            {digit}
          </CalcButton>
        ))}
        {operators.slice(1, 2).map((item) => (
          <CalcButton
            key={item.id}
            label={t(`tool.calculator.${item.name}`)}
            active={state.operator === item.id}
            onClick={() => setState((current) => chooseOperator(current, item.id))}
          >
            {item.label}
          </CalcButton>
        ))}
        {["4", "5", "6"].map((digit) => (
          <CalcButton
            key={digit}
            label={digit}
            onClick={() => setState((current) => inputDigit(current, digit))}
          >
            {digit}
          </CalcButton>
        ))}
        {operators.slice(2, 3).map((item) => (
          <CalcButton
            key={item.id}
            label={t(`tool.calculator.${item.name}`)}
            active={state.operator === item.id}
            onClick={() => setState((current) => chooseOperator(current, item.id))}
          >
            {item.label}
          </CalcButton>
        ))}
        {["1", "2", "3"].map((digit) => (
          <CalcButton
            key={digit}
            label={digit}
            onClick={() => setState((current) => inputDigit(current, digit))}
          >
            {digit}
          </CalcButton>
        ))}
        {operators.slice(3).map((item) => (
          <CalcButton
            key={item.id}
            label={t(`tool.calculator.${item.name}`)}
            active={state.operator === item.id}
            onClick={() => setState((current) => chooseOperator(current, item.id))}
          >
            {item.label}
          </CalcButton>
        ))}
        <CalcButton
          label="0"
          className="col-span-2"
          onClick={() => setState((current) => inputDigit(current, "0"))}
        >
          0
        </CalcButton>
        <CalcButton
          label={t("tool.calculator.decimal")}
          onClick={() => setState((current) => inputDecimal(current))}
        >
          .
        </CalcButton>
        <CalcButton
          label={t("tool.calculator.equals")}
          onClick={() => setState((current) => evaluate(current))}
        >
          =
        </CalcButton>
      </div>
    </div>
  );
}

function CalcButton({
  children,
  label,
  active = false,
  className = "",
  onClick,
}: {
  children: string;
  label: string;
  active?: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`h-12 rounded-xl border border-border bg-surface text-base font-medium hover:bg-secondary ${active ? "border-primary" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
