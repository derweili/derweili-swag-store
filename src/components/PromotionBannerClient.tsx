"use client";
import { useEffect, useState } from "react";
import type { Promotion } from "@/lib/storeApi/schema/promotion";
import PromotionBanner from "./PromotionBanner";

function isPromotionVisible(
  p: Pick<Promotion, "active" | "validFrom" | "validUntil">,
): boolean {
  if (!p.active) return false;
  const now = Date.now();
  const from = new Date(p.validFrom).getTime();
  const until = new Date(p.validUntil).getTime();
  if (!Number.isFinite(from) || !Number.isFinite(until)) return false;
  return now >= from && now <= until;
}

const PromotionBannerClient = ({
  active,
  validFrom,
  validUntil,
  title,
  description,
  code,
}: Promotion) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(isPromotionVisible({ active, validFrom, validUntil }));
  }, [active, validFrom, validUntil]);

  return (
    <div className={visible ? undefined : "invisible"} aria-hidden={!visible}>
      <PromotionBanner
        title={title}
        description={description}
        promoCode={code}
      />
    </div>
  );
};

export default PromotionBannerClient;
