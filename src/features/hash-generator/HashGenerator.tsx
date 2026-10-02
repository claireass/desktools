import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { hashText } from "@/features/hash-generator/logic";
import { hashAlgorithms, type HashAlgorithm } from "@/features/hash-generator/types";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

const labels = {
  md5: "MD5",
  sha1: "SHA-1",
  sha256: "SHA-256",
  sha512: "SHA-512",
} as const;

export function HashGenerator() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
  const [output, setOutput] = useState("");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid max-w-3xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        setCopied(false);
        setCopyDetail(null);
        setErrorDetail(null);
        void hashText(input, algorithm)
          .then((digest) => {
            setOutput(digest);
          })
          .catch((error: unknown) => {
            setOutput("");
            setErrorDetail(error instanceof Error ? error.message : "hash failed");
          })
          .finally(() => {
            setPending(false);
          });
      }}
    >
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.hash.input")}
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} min-h-32 font-mono`}
          spellCheck={false}
        />
      </label>
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.hash.algorithm")}</legend>
        <div
          className="mt-2 flex flex-wrap gap-2"
          role="radiogroup"
          aria-label={t("tool.hash.algorithm")}
        >
          {hashAlgorithms.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="hash-algorithm"
                value={item}
                checked={algorithm === item}
                onChange={() => setAlgorithm(item)}
              />
              {labels[item]}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={pending}>
        {t("tool.hash.generate")}
      </Button>
      {errorDetail ? (
        <div role="alert" className="text-sm">
          <p>{t("tool.hash.failed")}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-muted">{t("error.details")}</summary>
            <p className="mt-2 break-words text-muted">{errorDetail}</p>
          </details>
        </div>
      ) : null}
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.hash.output")}
        <output
          className={`${fieldClass} block min-h-12 break-all font-mono`}
          aria-live="polite"
        >
          {output}
        </output>
      </label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={output === ""}
          onClick={() => {
            void copyText(output)
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
      </div>
    </form>
  );
}
