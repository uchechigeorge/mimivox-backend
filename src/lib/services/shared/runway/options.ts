import { BadRequestError } from "@/lib/utils/error.util";
import { RunwayOptionSpec } from "./types";

// Validates user supplied model options against the model's spec and
// returns only the options Runway accepts for that model
export const parseRunwayOptions = (
  specs: RunwayOptionSpec[],
  input: Record<string, unknown> = {},
  modelLabel: string,
) => {
  const options: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;

    const spec = specs.find((e) => e.key === key);
    if (!spec) {
      throw new BadRequestError(`${modelLabel} does not support "${key}"`);
    }

    const invalid = () =>
      new BadRequestError(`Invalid value for "${key}" on ${modelLabel}`);

    switch (spec.type) {
      case "boolean":
        if (typeof value !== "boolean") throw invalid();
        break;
      case "select": {
        const match = spec.values?.find((e) => String(e) === String(value));
        if (match === undefined) throw invalid();
        options[key] = match;
        continue;
      }
      case "integer": {
        const number = Number(value);
        if (
          !Number.isInteger(number) ||
          (spec.min !== undefined && number < spec.min) ||
          (spec.max !== undefined && number > spec.max)
        ) {
          throw invalid();
        }
        options[key] = number;
        continue;
      }
      case "text":
        if (
          typeof value !== "string" ||
          (spec.maxLength && value.length > spec.maxLength)
        ) {
          throw invalid();
        }
        break;
    }

    options[key] = value;
  }

  return options;
};
