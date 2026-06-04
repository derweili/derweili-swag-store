import { serverEnv } from "@/lib/env/serverEnv";

const baseUrl = serverEnv.SWAG_STORE_API_URL.replace(/\/$/, "");

type SchemaWithParse<T = unknown> = { parse: (data: unknown) => T };

export class FetchApiHttpError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
  ) {
    super(`fetchApi failed: ${status} ${statusText}`);
    this.name = "FetchApiHttpError";
  }
}

export type FetchApiResult<T = unknown> = {
  data: T;
  metadata: Record<string, string>;
};

function headersToRecord(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

/**
 * Fetch wrapper for the WooCommerce Store API.
 * Pass the path (e.g. "/products"); it is prefixed with SWAG_STORE_API_URL.
 *
 * Returns { data, metadata } where data is the parsed JSON body and
 * metadata is the response headers (all keys lowercased).
 * Optionally pass a Zod schema as the third argument to parse and type `data`.
 */
export async function fetchApi(
  input: string,
  init?: RequestInit,
): Promise<FetchApiResult<unknown>>;
export async function fetchApi<TData>(
  input: string,
  init: RequestInit | undefined,
  schema: SchemaWithParse<TData>,
): Promise<FetchApiResult<TData>>;
export async function fetchApi(
  input: string,
  init?: RequestInit,
  schema?: SchemaWithParse,
): Promise<FetchApiResult<unknown>> {
  const url = `${baseUrl}${input.startsWith("/") ? input : `/${input}`}`;

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    console.error(`[fetchApi] Network error fetching ${url}:`, err);
    throw err;
  }

  if (!res.ok) {
    console.error(`[fetchApi] HTTP ${res.status} ${res.statusText} — ${url}`);
    throw new FetchApiHttpError(res.status, res.statusText);
  }

  const json = (await res.json()) as unknown;
  const metadata = headersToRecord(res.headers);

  if (schema != null) {
    return { data: schema.parse(json), metadata };
  }

  return { data: json, metadata };
}
