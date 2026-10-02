import type { RefObject } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";

type FileSelectProps = {
  label: string;
  accept?: string;
  multiple?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onFiles: (files: File[]) => void;
};

export function FileSelect({
  label,
  accept,
  multiple = false,
  inputRef,
  onFiles,
}: FileSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className={`${fieldClass} file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-sm file:text-secondary-foreground`}
        onChange={(event) => {
          onFiles([...(event.target.files ?? [])]);
        }}
      />
    </label>
  );
}
