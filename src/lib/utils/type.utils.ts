/**
 * Checks to see string value is empty or whitespace
 * @param value Value to check
 * @returns If value is null, undefined, empty or whitespace, returns true. Otherwise, returns false.
 */
export const isNullOrWhitespace = (value: string | null | undefined) => {
  return value == null || value.toString()?.trim().length == 0;
};

/**
 * Checks to see string value is empty or null
 * @param value Value to check
 * @returns If value is null, undefined or empty, returns true. Otherwise, returns false.
 */
export const isNullOrEmpty = (value: string) => {
  return !value || value?.length == 0;
};

/**
 * Checks if the provided value is a valid date
 * @param arr Value to check
 * @returns A boolean to indicate if value is a valid date
 */
export const isValidDate = (value: any) => {
  const date: any = new Date(value);
  const valid = value != null && !isNaN(date) && date instanceof Date;
  return valid;
};

/**
 * Checks if the provided value, sent via request params, is valid for a boolean.
 * Truthy values includes: true, 1
 * Falsy values includes: false, 0
 * @param arr Value to check
 * @returns Returns a boolean value if value is valid. Otherwise, returns null
 */
export const getValidBooleanFromParam = (value: any): boolean | null => {
  const paramValue = value?.toString()?.toLowerCase();

  const isValidParam =
    paramValue == "1" ||
    paramValue == "true" ||
    paramValue == "0" ||
    paramValue == "false";

  if (!isValidParam) return null;

  return paramValue == "1" || paramValue == "true";
};

/**
 * Checks if the provided value is an array
 * @param arr Value to check
 * @returns A boolean to indicate if value is an array
 */
export const isArray = (arr: any) => {
  return arr?.constructor === Array;
};

/**
 * Checks if an array has duplicate values
 * @param arr Input array
 * @returns
 */
export const findDuplicates = (arr: any[]) =>
  arr.filter((item, index) => arr.indexOf(item) != index);

/**
 * Returns an int value from string. If value isNan, returns null
 * @param value Input value
 * @returns Number value
 */
export const getInt = (value: any) => {
  return !isNaN(parseFloat(value)) ? parseInt(value) : null;
};

/**
 * Returns a float value from string. If value isNan, returns null
 * @param value Input value
 * @returns Number value
 */
export const getFloat = (value: any) => {
  return !isNaN(parseFloat(value)) ? parseFloat(value) : null;
};

/**
 * Returns a Boolean value from string. Returns false for non-boolean values by default
 * @param value Input value
 * @param allowNull If set to true and `value` is not a valid Boolean value, returns null, otherwise returns false.
 * @returns Boolean value
 */
export const getBoolean = (value: any, allowNull?: boolean) => {
  if (allowNull) {
    return value == "true" || value == true
      ? true
      : value == "false" || value == false
        ? false
        : null;
  }

  return value == "true" || value == true ? true : false;
};
