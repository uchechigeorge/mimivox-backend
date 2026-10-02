import { z } from "zod";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

// Accepts an ISO date or timestamp; anything unparseable is ignored.
// A date-only end date (e.g. 2026-10-02) covers that whole day.
const optionalDate = (endOfDay: boolean) =>
  z
    .preprocess((value) => {
      if (typeof value !== "string" || !value.trim()) return undefined;
      const text = value.trim();
      return endOfDay && DATE_ONLY.test(text) ? `${text}T23:59:59.999Z` : text;
    }, z.coerce.date().optional())
    .catch(undefined);

// Filters lists by when the record was created (createdAt), both ends inclusive
export const dateRangeParamsSchema = {
  startDate: optionalDate(false),
  endDate: optionalDate(true),
};
