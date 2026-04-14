export interface HandlerOptions {
  authenticate?: boolean;
  ignoreAuth?: boolean; // If true, allows request even if token is missing/invalid
}

export type AppRouteContext<T> = {
  params: Promise<T>;
};

export type AppGetRouteContext = AppRouteContext<{ id: string }>;
