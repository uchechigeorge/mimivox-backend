export interface HandlerOptions {
  authenticate?: boolean;
  ignoreAuth?: boolean; // If true, allows request even if token is missing/invalid
}
