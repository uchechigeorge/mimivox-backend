import { NextResponse } from "next/server";
import z from "zod";
import { AppError } from "./error";
import { errorResponse } from "./response";
import { UserAuthItems } from "../types";
import authService from "../services/user/auth";

interface HandlerOptions {
  authenticate?: boolean;
  ignoreAuth?: boolean; // If true, allows request even if token is missing/invalid
}

export const userHandler =
  (
    fn: (req: Request, ctx: any, auth: UserAuthItems) => Promise<Response>,
    options?: HandlerOptions,
  ) =>
  async (req: Request, ctx?: any) => {
    try {
      const authData = await handleUserAuth(req, options);

      return await fn(req, ctx, authData);
    } catch (err: any) {
      return handleError(err);
    }
  };

const handleError = (err: any) => {
  if (err instanceof z.ZodError) {
    return NextResponse.json(
      errorResponse("Validation error", 400, err.issues),
      {
        status: 400,
      },
    );
  }

  if (err instanceof AppError) {
    return NextResponse.json(errorResponse(err.message, err.statusCode), {
      status: err.statusCode,
    });
  }

  console.error(err?.stack);
  // logger.error(err?.message, err);

  return NextResponse.json(errorResponse(err.message, 500), {
    status: err.statusCode || 500,
  });
};

const handleUserAuth = async (req: Request, options?: HandlerOptions) => {
  let authData: UserAuthItems = { loggedIn: false };

  if (options?.authenticate) {
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.split(" ")[1];

    authData = {
      loggedIn: false,
    };

    if (!bearerToken) {
      if (!options.ignoreAuth) {
        throw new AppError("No token provided", 401);
      }
    } else {
      // Verify Token
      const [jwtResult, jwtError] =
        await authService.verifyAccessToken(bearerToken);

      if (jwtError) {
        authData.errorMessage = "Invalid token";
        if (!options.ignoreAuth) {
          throw new AppError("Invalid or expired token", 401);
        }
      } else {
        // Success: Populate auth data
        authData = {
          ...authData,
          loggedIn: true,
          userId: jwtResult.userId,
          userFullName: jwtResult.name,
          userEmail: jwtResult.email,
        };
      }
    }
  }

  return authData;
};
