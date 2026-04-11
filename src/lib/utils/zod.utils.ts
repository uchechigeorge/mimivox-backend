import { z, ZodType } from "zod";

export const rString = z.string().trim().min(1);
export const rNumber = z.coerce.number();
export const oString = z
  .string()
  .nullish()
  .transform((e) => (e === undefined ? null : e !== null ? e.trim() : null));
export const oNumber = z.coerce
  .number()
  .nullish()
  .transform((e) => e || null);
export const nNumber = z.coerce.number().nullish();
export const nString = z.string().nullish();
export const nDate = z.coerce.date().nullish();
export const nBoolean = z.boolean().catch(false);

export const normalizeOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (val === null || val === undefined) return undefined;

    if (typeof val === "string") {
      const trimmed = val.trim();

      if (
        trimmed === "" ||
        trimmed.toLowerCase() === "null" ||
        trimmed.toLowerCase() === "undefined"
      ) {
        return undefined;
      }

      return trimmed;
    }

    return val;
  }, schema.optional());

export const stringToBoolean = z
  .string()
  .trim()
  .nullish()
  .transform((e) => e != null && e.toLowerCase() == "true")
  .or(z.boolean())
  .pipe(z.boolean().catch(false));

export const stringToNullableBoolean = z
  .string()
  .trim()
  .nullish()
  .transform((e) => {
    switch (e) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return undefined;
    }
  })
  .or(z.boolean())
  .pipe(z.boolean().optional());

export async function parseArr<T, S>(
  items: T[],
  schema: ZodType<S>,
): Promise<S[]> {
  const parsed = await Promise.all(items.map((e) => schema.parseAsync(e)));
  return parsed;
}
