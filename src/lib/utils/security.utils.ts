import crypto from "crypto";

/**
 * Generates a random string
 * @param length Lenth of string to generate
 * @param options Options for string generation
 * @returns A random string
 */
export const generateRandomString = (
  length: number = 10,
  options?: {
    type?: "alpha-numeric" | "alpha" | "numeric";
    includeSymbols?: boolean;
    caseSensitive?: boolean;
  },
) => {
  let type = options?.type;
  if (!options?.type) {
    type = "alpha-numeric";
  }

  const upperCaseLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";
  const lowerCaseLetters = "qwertyuiopasdfghjklzxcvbnm";
  const numbers = "0123456789";

  let characters = "";

  switch (type) {
    case "alpha":
      characters = upperCaseLetters;
      if (options?.caseSensitive) {
        characters += lowerCaseLetters;
      }
      break;
    case "alpha-numeric":
      characters = upperCaseLetters + numbers;
      if (options?.caseSensitive) {
        characters += lowerCaseLetters;
      }
      break;
    case "numeric":
      characters = numbers;
  }

  if (options?.includeSymbols) characters += ".,/@#%*&-+=?!";

  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters[getRandom(0, characters.length - 1)];
  }

  return randomString;
};

export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Tries to encrypt a string using aes-256 algorithm
 * @param text String to encrypt
 * @returns An array containing the encrypted string and a boolean flag for the validation status.
 * If the decryption is not valid, the error message is returned
 */
export const encryptData = (text: string): [string, Error?] => {
  try {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPT_KEY ?? "", "hex");
    const iv = Buffer.from(process.env.ENCRYPT_IV ?? "", "hex");

    let cipher = crypto.createCipheriv(algorithm, key, iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    return [encrypted.toString("hex")];
  } catch (err: any) {
    return [null!, err];
  }
};

/**
 * Tries to decrypt a string which was encrypted using aes-256 algorithm
 * @param text String to decrypt
 * @returns An array containing the decrypted string and a boolean flag for the validation status.
 * If the decryption is not valid, the error message is returned
 */
export const decryptData = (text: string): [any, Error?] => {
  try {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPT_KEY ?? "", "hex");
    const iv = Buffer.from(process.env.ENCRYPT_IV ?? "", "hex");

    let encryptedText = Buffer.from(text, "hex");

    // Creating Decipher
    let decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return [decrypted.toString()];
  } catch (err: any) {
    return [null!, err];
  }
};

export const base64Encode = (value: string) => {
  const base64Str = btoa(value);
  return base64Str;
};
