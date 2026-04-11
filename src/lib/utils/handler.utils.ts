import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { AppError, UnauthorizedError } from "./error.util";
import { errorResponse } from "./response.utils";
import { UserAuthItems } from "../types";
import userAuthService from "../services/user/auth";
import adminAuthService from "../services/admin/auth";
import { AppRouteContext, HandlerOptions } from "./types";
import { AdminAuthItems } from "../types/AuthItems";

export const userHandler =
  <TParams>(
    fn: (
      req: NextRequest,
      ctx: AppRouteContext<TParams>,
      auth: UserAuthItems,
    ) => Promise<Response>,
    options?: HandlerOptions,
  ) =>
  async (req: NextRequest, ctx: AppRouteContext<TParams>) => {
    try {
      const authData = await handleUserAuth(req, options);

      return await fn(req, ctx, authData);
    } catch (err: any) {
      return handleError(err);
    }
  };

export const adminHandler =
  <TParams>(
    fn: (
      req: NextRequest,
      ctx: AppRouteContext<TParams>,
      auth?: AdminAuthItems,
    ) => Promise<Response>,
    options?: HandlerOptions,
  ) =>
  async (req: NextRequest, ctx: AppRouteContext<TParams>) => {
    try {
      const authData = await handleAdminAuth(req, options);

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

    // if (!bearerToken) {
    //   if (!options.ignoreAuth) {
    //     throw new UnauthorizedError("No token provided", 401);
    //   }
    // } else {
    //   // Verify Token
    //   const [jwtResult, jwtError] =
    //     await userAuthService.verifyAccessToken(bearerToken);

    //   if (jwtError) {
    //     authData.errorMessage = "Invalid token";
    //     if (!options.ignoreAuth) {
    //       throw new UnauthorizedError("Invalid or expired token", 401);
    //     }
    //   } else {
    //     // Success: Populate auth data
    //     authData = {
    //       ...authData,
    //       loggedIn: true,
    //       userId: jwtResult.userId,
    //       userFullName: jwtResult.name,
    //       userEmail: jwtResult.email,
    //     };
    //   }
    // }
  }

  return authData;
};

const handleAdminAuth = async (req: Request, options?: HandlerOptions) => {
  let authData: AdminAuthItems = { loggedIn: false };

  // !Remove this
  options = {
    authenticate: false,
  };
  // !Remove this

  if (options?.authenticate) {
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.split(" ")[1];

    authData = {
      loggedIn: false,
    };

    if (!bearerToken) {
      if (!options.ignoreAuth) {
        throw new UnauthorizedError("No token provided");
      }
    } else {
      // Verify Token
      const [jwtResult, jwtError] =
        await adminAuthService.verifyAccessToken(bearerToken);

      if (jwtError) {
        authData.errorMessage = "Invalid token";
        if (!options.ignoreAuth) {
          throw new UnauthorizedError("Invalid or expired token", 401);
        }
      } else {
        // Success: Populate auth data
        authData = {
          ...authData,
          loggedIn: true,
          adminId: jwtResult.adminId,
          claims: jwtResult,
          adminName: jwtResult.name,
          adminEmail: jwtResult.email,
        };
      }
    }
  }

  return authData;
};
