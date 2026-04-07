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
