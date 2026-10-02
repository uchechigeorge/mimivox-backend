export type DateRangeParams = {
  startDate?: Date;
  endDate?: Date;
};

// Prisma filter for a createdAt range, or undefined when no dates are given
export const createdAtRange = ({ startDate, endDate }: DateRangeParams) => {
  if (!startDate && !endDate) return undefined;

  return {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  };
};
