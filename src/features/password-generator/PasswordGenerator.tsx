import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import {
  generatePassword,
  passwordAlphabetSize,
  passwordEntropyBits,
} from "@/features/password-generator/logic";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

export function PasswordGenerator() {
  const { t } = useI18n();
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [entropy, setEntropy] = useState<number | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);

  const options = { length, lower, upper, digits, symbols, avoidAmbiguous };

  return (
    <div className="grid max-w-xl gap-4">
      <p className="text-sm text-muted">{t("tool.password.note")}</p>
      <label className="grid gap-2 text-sm">
        {t("tool.password.length")}
        <input
          className={fieldClass}
          type="number"
          min={8}
          max={128}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </label>
      <fieldset className="grid gap-2 text-sm">
        <legend>{t("tool.password.sets")}</legend>
        <Check label={t("tool.password.lower")} checked={lower} onChange={setLower} />
        <Check label={t("tool.password.upper")} checked={upper} onChange={setUpper} />
        <Check label={t("tool.password.digits")} checked={digits} onChange={setDigits} />
        <Check
          label={t("tool.password.symbols")}
          checked={symbols}
          onChange={setSymbols}
        />
        <Check
          label={t("tool.password.ambiguous")}
          checked={avoidAmbiguous}
          onChange={setAvoidAmbiguous}
        />
      </fieldset>
      <Button
        type="button"
        onClick={() => {
          const next = generatePassword(options);
          setInvalid(next === null);
          setPassword(next ?? "");
          setEntropy(
            next === null
              ? null
              : passwordEntropyBits(options.length, passwordAlphabetSize(options)),
          );
          setCopied(false);
          setCopyDetail(null);
        }}
      >
        {t("tool.password.generate")}
      </Button>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.password.invalid")}
        </p>
      ) : null}
      {password ? (
        <>
          <output className={`${fieldClass} block break-all font-mono`}>
            {password}
          </output>
          {entropy !== null ? (
            <p className="text-sm text-muted">
              {t("tool.password.entropy")} {entropy} {t("tool.password.bits")}
            </p>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void copyText(password)
                .then(() => {
                  setCopied(true);
                  setCopyDetail(null);
                })
                .catch((error: unknown) => {
                  setCopied(false);
                  setCopyDetail(error instanceof Error ? error.message : "copy failed");
                });
            }}
          >
            {t("common.copy")}
          </Button>
          {copied ? <p className="text-sm text-success">{t("common.copied")}</p> : null}
          {copyDetail ? (
            <p className="text-sm text-danger" role="alert">
              {t("common.copyFailed")} {copyDetail}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
