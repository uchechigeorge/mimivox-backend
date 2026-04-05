import { UserAuthItems } from "@/lib/types";
import { UserMeResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import { UnauthorizedError } from "@/lib/utils/error";

export const getAuthenticatedUser = async (authItems: UserAuthItems) => {
  if (!authItems.loggedIn || !authItems.userId) {
    throw new UnauthorizedError();
  }
  const credentials = await getCredentials(authItems.userId);

  const response: UserMeResponse = {
    credentials,
  };

  return response;
};
