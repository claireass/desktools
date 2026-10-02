import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useI18n } from "@/hooks/useI18n";
import { isTauri } from "@/services/platform";
import { useUpdateOfferStore } from "@/stores/updateOfferStore";

export function UpdateOffer() {
  const { t } = useI18n();
  const lookup = useUpdateOfferStore((state) => state.lookup);
  const installing = useUpdateOfferStore((state) => state.installing);
  const decline = useUpdateOfferStore((state) => state.decline);
  const install = useUpdateOfferStore((state) => state.install);
  const version = lookup?.status === "available" && isTauri() ? lookup.version : null;

  return (
    <Dialog
      open={version !== null}
      title={t("settings.updates.askTitle")}
      onClose={decline}
      closeOnEscape={!installing}
      closeOnBackdrop={!installing}
    >
      <p className="text-sm text-muted">
        {t("settings.updates.ask")} {version ? `v${version}` : ""}
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" disabled={installing} onClick={decline}>
          {t("settings.updates.later")}
        </Button>
        <Button disabled={installing} onClick={() => void install()}>
          {installing
            ? t("settings.updates.downloading")
            : t("settings.updates.download")}
        </Button>
      </div>
    </Dialog>
  );
}
