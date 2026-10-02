import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { decodeUrlText, encodeUrlText } from "@/features/url-codec/logic";
import { useI18n } from "@/hooks/useI18n";

export function UrlCodec() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [invalid, setInvalid] = useState(false);

  function show(next: string | null) {
    if (next === null) {
      setOutput("");
      setInvalid(true);
      return;
    }
    setOutput(next);
    setInvalid(false);
  }

  return (
    <div className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        {t("tool.urlCodec.input")}
        <textarea
          className={`${fieldClass} min-h-28 font-mono`}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => show(encodeUrlText(input))}>
          {t("tool.urlCodec.encode")}
        </Button>
        <Button type="button" variant="secondary" onClick={() => show(decodeUrlText(input))}>
          {t("tool.urlCodec.decode")}
        </Button>
      </div>
      <output className={`${fieldClass} block min-h-12 whitespace-pre-wrap font-mono`} aria-live="polite">
        {output}
      </output>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.urlCodec.invalid")}
        </p>
      ) : null}
    </div>
  );
}
