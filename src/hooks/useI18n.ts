import { useCallback } from "react";
import type { MessageKey } from "@/i18n/messages";
import { translate } from "@/i18n/translate";
import { useSettingsStore } from "@/stores/settingsStore";

export function useI18n() {
  const locale = useSettingsStore((state) => state.locale);
  const t = useCallback((key: MessageKey) => translate(locale, key), [locale]);
  return { locale, t };
}
