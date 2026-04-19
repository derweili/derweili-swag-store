type PromotionBannerProps = {
  title: string;
  description: string;
  promoCode: string;
};

const MARQUEE_REPEAT_KEYS = [
  "marquee-a",
  "marquee-b",
  "marquee-c",
  "marquee-d",
  "marquee-e",
  "marquee-f",
] as const;

const PromoBanner = ({
  title,
  description,
  promoCode,
}: PromotionBannerProps) => {
  return (
    <div className="overflow-hidden border-y border-accent/30 bg-accent/5">
      <div className="animate-marquee flex whitespace-nowrap py-3">
        {MARQUEE_REPEAT_KEYS.map((key) => (
          <span
            key={key}
            className="mx-8 flex items-center gap-4 text-sm font-display uppercase tracking-widest"
          >
            <span className="text-accent font-bold">{title}</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-foreground">{description}</span>
            <span className="text-muted-foreground">—</span>
            <span className="border border-accent px-3 py-0.5 text-accent font-bold text-xs">
              {promoCode}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
