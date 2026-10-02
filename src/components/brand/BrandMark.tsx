type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "size-8" }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <rect
        x="7"
        y="8"
        width="18"
        height="16"
        rx="3"
        className="fill-primary-foreground"
      />
      <rect x="10" y="12" width="8" height="2" rx="1" className="fill-primary" />
      <rect x="10" y="16" width="12" height="2" rx="1" className="fill-primary" />
      <rect x="10" y="20" width="5" height="2" rx="1" className="fill-primary" />
    </svg>
  );
}
