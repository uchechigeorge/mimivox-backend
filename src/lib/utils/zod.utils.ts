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

// export const nObjPromise = (value: any) => {
//   return z
//     .object(value)
//     .nullish()
//     .promise()
//     .transform(async (e) => await e)
//     .catch(null);
// };

// export const nArrPromise = (value: any) => {
//   return z
//     .object(value)
//     .nullish()
//     .array()
//     .nullish()
//     .promise()
//     .transform(async (e) => await e)
//     .catch([]);
// };

// export const parsedOptionalNumber = z
//   .string()
//   .trim()
//   .or(z.number())
//   .nullish()
//   .transform((e) => (e == undefined || e == "" ? undefined : e))
//   .pipe(z.coerce.number().optional().catch(undefined));

// export const stringToOptionalNumber = z
//   .string()
//   .trim()
//   .nullish()
//   .transform((e) => (e == "" || e == null ? undefined : e))
//   .pipe(
//     z.coerce
//       .number()
//       .optional()
//       .transform((e) => (e == null || isNaN(e) ? undefined : e))
//   );

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

// export const stringToDate = (defaultValue?: Date) => {
//   return z
//     .string()
//     .nullish()
//     .transform((e) => (e == undefined || e.trim() == "" ? undefined : e))
//     .pipe(
//       defaultValue ? z.coerce.date().default(defaultValue) : z.coerce.date()
//     );
// };

// export const stringToNullableDate = z
//   .string()
//   .nullish()
//   .transform((e) => e ?? undefined)
//   .pipe(z.coerce.date().optional().catch(undefined));

// export function stringToEnum<T>(type: T) {
//   return z
//     .string()
//     .or(z.number())
//     .transform((val, ctx) => {
//       const parsed = parseEnum(type, val.toString());
//       if (parsed == null) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Invalid enum value",
//         });

//         return z.NEVER;
//       }

//       return parsed;
//     });
// }

export async function parseArr<T, S>(
  items: T[],
  schema: ZodType<S>,
): Promise<S[]> {
  const parsed = await Promise.all(items.map((e) => schema.parseAsync(e)));
  return parsed;
}
