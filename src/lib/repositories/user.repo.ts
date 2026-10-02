import { Prisma, Subscription, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  UserCreateArgs,
  UserFindManyArgs,
  UserUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNotNullOrWhitespace } from "../utils/type.utils";
import { getDefaultDp } from "../services/user/users/get-default-dp.service";

const getById = async (id: User["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.user.findUnique({
    where: { id },
  });
};

const getByIdWithLock = async (
  id: User["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  const rows = await db.$queryRaw<User[]>`
    SELECT * FROM "Users"
    WHERE id = ${id}
    FOR UPDATE
  `;

  if (rows.length < 1) return null;

  return rows[0];
};

const getByEmail = async (email: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.user.findUnique({
    where: { email },
  });
};

const getExistsByEmail = async (
  email: string,
  tc?: Prisma.TransactionClient,
) => {
  const user = await getByEmail(email, tc);
  return user !== null;
};

const create = async (
  data: UserCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.user.create({
    data: {
      ...data,
      fullName: `${data.firstName.trim()} ${data.lastName}`.trim(),
    },
  });
};

const update = async (
  id: User["id"],
  data: UserUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.user.update({
    where: { id },
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  fullName: "fullName",
  dateModified: "dateModified",
  dateCreated: "dateCreated",
};

const buildWhere = (params: UserGetParams) => {
  const where: NonNullable<UserFindManyArgs["where"]> = {};

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (params.blocked != null) where.blocked = params.blocked;
  if (params.hasActiveSubscription != null) {
    where.hasActiveSubscription = params.hasActiveSubscription;
  }
  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = params.startDate;
    if (params.endDate) {
      // Include the whole end day
      const end = new Date(params.endDate);
      end.setUTCHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (isNotNullOrWhitespace(params.searchString)) {
    const search = params.searchString!.trim();
    where.OR = ["fullName", "firstName", "lastName", "email"].map(
      (column) => ({ [column]: { contains: search, mode: "insensitive" } }), // LIKE '%searchString%'
    );
  }

  return where;
};

export const query = async (
  params: UserGetParams,
  options?: UserGetOptions,
): Promise<
  [(User & { activeSubscription?: Subscription | null })[], number]
> => {
  // Build `where` filter
  const where = buildWhere(params);

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "createdAt"] ?? "createdAt";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.user.count({ where });
  const result: (User & { activeSubscription?: Subscription | null })[] =
    await prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
    });

  // Include active subscriptions
  if (options?.includeRelations) {
    const userIds = result.map((u) => u.id);
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: { in: userIds }, isActive: true },
    });
    // Associate subscriptions with users
    result.forEach((user) => {
      user.activeSubscription =
        subscriptions.filter((s) => s.userId === user.id).at(0) ?? null;
    });
  }

  result.forEach((e) => {
    e.dpUrl = getDefaultDp(e);
  });

  return [result, total];
};

// Counts for the summary cards, using the same filters as the list
const getSubscriberSummary = async (params: UserGetParams = {}) => {
  const where = buildWhere(params);
  const [total, active] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.count({
      where: { AND: [where, { hasActiveSubscription: true }] },
    }),
  ]);
  return { total, active, inactive: total - active };
};

type UserGetParams = BaseGetParams & {
  blocked?: boolean;
  hasActiveSubscription?: boolean;
  startDate?: Date;
  endDate?: Date;
};

export type UserGetOptions = BaseGetOptions & {};

const userRepo = {
  getById,
  getByIdWithLock,
  getByEmail,
  getExistsByEmail,
  create,
  update,
  query,
  getSubscriberSummary,
};

export default userRepo;
