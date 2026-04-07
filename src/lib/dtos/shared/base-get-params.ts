import { baseGetParamsSchema } from "@/lib/validators/shared/base-get-params.validator";
import { z } from "zod";

const schema = z.object(baseGetParamsSchema);

export type BaseGetParams = z.infer<typeof schema> & { id?: string };
export type BaseGetOptions = {
  includeRelations?: boolean;
};
