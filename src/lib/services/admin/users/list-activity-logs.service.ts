import { ListUserActivityLogsParams } from "@/lib/dtos/admin/user.dto";
import adminActionLogRepo from "@/lib/repositories/admin-action-log.repo";

export const listUserActivityLogs = async (
  params: ListUserActivityLogsParams,
) => {
  const [data, total] = await adminActionLogRepo.listByUserId(
    params.id,
    params.page ?? undefined,
    params.pageSize ?? undefined,
  );

  return [data, { total }] as const;
};
