import jwt from "jsonwebtoken";

export async function verifyJwt<T>(
  token: string,
  secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  options?:
    | (jwt.VerifyOptions & {
        complete?: false | undefined;
      })
    | undefined,
): Promise<JwtResult<T>> {
  try {
    const result: string | jwt.JwtPayload | undefined = await new Promise(
      (resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, options, (error, value) => {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        });
      },
    );

    const r = result as JwtPayload<T>;

    return [r, null];
  } catch (err: any) {
    return [null, err];
  }
}

type JwtResult<T> = JwtResultSuccess<T> | JwtResultError;

type JwtResultSuccess<T> = [JwtPayload<T>, null];

type JwtResultError = [null, Error];

type JwtPayload<T> = T & jwt.JwtPayload;
