import { serverEnv } from "@/lib/env/serverEnv";

const baseUrl = serverEnv.SWAG_STORE_API_URL.replace(/\/$/, "");

type SchemaWithParse = { parse: (data: unknown) => unknown };

/** API error payload when success is false */
export type ApiErrorResponse = {
  code: string;
  message: string;
  details: null;
};

/** Success envelope: data and optional meta */
export type ApiSuccessEnvelope<T = unknown> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

function isApiErrorResponse(
  json: unknown,
): json is { success: false; error: ApiErrorResponse } {
  return (
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    (json as { success: unknown }).success === false &&
    "error" in json &&
    typeof (json as { error: unknown }).error === "object"
  );
}

function isApiSuccessResponse(json: unknown): json is ApiSuccessEnvelope {
  return (
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    (json as { success: unknown }).success === true &&
    "data" in json
  );
}

/**
 * Fetch wrapper for the swag store API.
 * Pass the path (e.g. "/products"); it is prefixed with SWAG_STORE_API_URL.
 * Automatically sets the x-vercel-protection-bypass header from SWAG_STORE_API_KEY.
 *
 * Responses follow the envelope: { success: true, data, meta? } or { success: false, error: { code, message, details } }.
 * On success: false an ApiError is thrown; on success: true the data (and optional meta when no schema) is returned.
 *
 * Optionally pass a Zod schema as the third argument to parse and type `data`.
 */
export async function fetchApi(
  input: string,
  init?: RequestInit,
): Promise<ApiSuccessEnvelope>;
export async function fetchApi<T extends SchemaWithParse>(
  input: string,
  init: RequestInit | undefined,
  schema: T,
): Promise<T["parse"] extends (data: unknown) => infer R ? R : never>;
export async function fetchApi(
  input: string,
  init?: RequestInit,
  schema?: SchemaWithParse,
): Promise<ApiSuccessEnvelope | unknown> {
  const url = `${baseUrl}${input.startsWith("/") ? input : `/${input}`}`;
  console.log("fetchApi url:", url);
  const headers = {
    ...(init?.headers || {}),
    "x-vercel-protection-bypass": serverEnv.SWAG_STORE_API_KEY,
  };

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    throw new Error(`fetchApi failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as unknown;

  if (isApiErrorResponse(json)) {
    const { code, message, details } = json.error;

    console.error("fetchApi failed:", code, message, details);
    throw new Error(message);
  }

  if (!isApiSuccessResponse(json)) {
    throw new Error("fetchApi: invalid response envelope");
  }

  if (schema != null) {
    return schema.parse(json.data);
  }

  return json;
}
