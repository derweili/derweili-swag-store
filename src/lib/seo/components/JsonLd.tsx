import { createElement } from "react";
import { serializeJsonLd } from "../jsonld";

export function JsonLd({ data }: { data: object }) {
  return createElement("script", {
    type: "application/ld+json",
    // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional — JSON-LD structured data, sanitized via serializeJsonLd
    dangerouslySetInnerHTML: { __html: serializeJsonLd(data) },
  });
}
