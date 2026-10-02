import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
};

const FOCUSABLE =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function Dialog({
  open,
  title,
  onClose,
  children,
  closeOnEscape = true,
  closeOnBackdrop = true,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (item) => !item.hasAttribute("disabled"),
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
