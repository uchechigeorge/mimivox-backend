import { AdminAuthItems } from "@/lib/types";
import { AdminMeResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const getAuthenticatedAdmin = async (authItems: AdminAuthItems) => {
  if (!authItems.loggedIn || !authItems.adminId) {
    throw new UnauthorizedError();
  }

  const credentials = await getCredentials(authItems.adminId);

  const response: AdminMeResponse = {
    credentials,
  };

  return response;
};
