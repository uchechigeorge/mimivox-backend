import { NextRequest, NextResponse } from "next/server";
import authService from "../services/user/auth";

interface AuthOptions {
  ignoreAuth?: boolean;
}

export interface UserAuthItems {
  loggedIn: boolean;
  token?: string;
  uuid?: string | null;
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  hasActiveSubscription?: boolean;
  errorMessage?: string;
}

export interface AuthRequest extends NextRequest {
  userAuthItems: UserAuthItems;
}

export const withAuth = (options?: AuthOptions) => {
  return async (req: NextRequest): Promise<Response | null> => {
    try {
      const authHeader = req.headers.get("authorization");
      const bearerToken = authHeader?.split(" ")[1];
      // const uuid = req.headers.get("uuid");

      const userAuthItems: UserAuthItems = {
        loggedIn: false,
      };

      // No token case
      if (!bearerToken) {
        const message = "No token";
        userAuthItems.errorMessage = message;

        if (!options?.ignoreAuth) {
          return NextResponse.json({ status: 401, message }, { status: 401 });
        }

        // Attach to request and continue
        (req as AuthRequest).userAuthItems = userAuthItems;
        return null; // Continue to handler
      }

      // Verify token
      const [jwtResult, jwtError] =
        await authService.verifyAccessToken(bearerToken);

      // Invalid token case
      if (jwtError) {
        const message = "Invalid token";
        userAuthItems.errorMessage = message;

        if (!options?.ignoreAuth) {
          return NextResponse.json({ status: 401, message }, { status: 401 });
        }

        (req as AuthRequest).userAuthItems = userAuthItems;
        return null; // Continue to handler
      }

      // Success case
      userAuthItems.loggedIn = true;
      userAuthItems.userId = jwtResult?.userId;
      userAuthItems.userFullName = jwtResult.name;
      userAuthItems.userEmail = jwtResult.email;
      userAuthItems.hasActiveSubscription = jwtResult.hasActiveSubscription;

      (req as AuthRequest).userAuthItems = userAuthItems;
      return null; // Continue to handler
    } catch (err: any) {
      return NextResponse.json(
        { status: 500, message: err.message },
        { status: 500 },
      );
    }
  };
};
