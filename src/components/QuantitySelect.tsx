import { Minus, Plus } from "lucide-react";

type QuantitySelectProps = {
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  maxQuantity: number;
};

export const QuantitySelect = ({
  quantity,
  onQuantityChange,
  maxQuantity,
}: QuantitySelectProps) => {
  return (
    <div className="mt-6 flex items-center gap-4">
      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Qty
      </span>
      <div className="flex items-center border border-border">
        <button
          type="button"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
          className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-11 w-14 items-center justify-center border-x border-border font-display font-semibold">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() =>
            onQuantityChange?.(Math.min(maxQuantity, quantity + 1))
          }
          className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
