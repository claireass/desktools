import { messages, type MessageKey } from "@/i18n/messages";
import type { Locale } from "@/types/settings";

export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}

export function isMessageKey(value: string): value is MessageKey {
  return value in messages.tr;
}
