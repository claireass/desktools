import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { decodeJwt, type JwtView } from "@/features/jwt-decoder/logic";
import { useI18n } from "@/hooks/useI18n";

export function JwtDecoder() {
  const { t } = useI18n();
  const [token, setToken] = useState("");
  const [view, setView] = useState<JwtView | null>(null);
  const [invalid, setInvalid] = useState(false);

  return (
    <div className="grid max-w-xl gap-4">
      <p className="text-sm text-muted">{t("tool.jwt.unverified")}</p>
      <label className="grid gap-2 text-sm">
        {t("tool.jwt.input")}
        <textarea
          className={`${fieldClass} min-h-28 font-mono`}
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </label>
      <Button
        type="button"
        onClick={() => {
          const next = decodeJwt(token);
          setInvalid(next === null);
          setView(next);
        }}
      >
        {t("tool.jwt.decode")}
      </Button>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.jwt.invalid")}
        </p>
      ) : null}
      {view ? (
        <>
          <Claim label={t("tool.jwt.exp")} value={view.claims.exp} />
          <Claim label={t("tool.jwt.nbf")} value={view.claims.nbf} />
          <Claim label={t("tool.jwt.iat")} value={view.claims.iat} />
          <Section title={t("tool.jwt.header")} text={view.header} />
          <Section title={t("tool.jwt.payload")} text={view.payload} />
          <Section
            title={t("tool.jwt.signature")}
            text={view.signature || t("tool.jwt.emptySignature")}
          />
        </>
      ) : null}
    </div>
  );
}

function Claim({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }
  return (
    <p className="text-sm">
      {label}: <span className="font-mono">{value}</span>
    </p>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section className="grid gap-2 text-sm">
      <h2 className="font-medium">{title}</h2>
      <pre className={`${fieldClass} overflow-auto whitespace-pre-wrap font-mono`}>
        {text}
      </pre>
    </section>
  );
}
