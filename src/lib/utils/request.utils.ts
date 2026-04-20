import { NextRequest } from "next/server";

export function getQueryParams(req: NextRequest) {
  const params: Record<string, string | string[]> = {};

  req.nextUrl.searchParams.forEach((value, key) => {
    if (params[key]) {
      params[key] = Array.isArray(params[key])
        ? [...(params[key] as string[]), value]
        : [params[key] as string, value];
    } else {
      params[key] = value;
    }
  });

  return params;
}

export function buildSearchParams(params?: Record<string, any>) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
