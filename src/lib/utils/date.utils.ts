import { IntervalTypes } from "@/lib/data/IntervalTypes";

export const getNextBillingDate = (
  startDate: Date | string,
  intervalType: IntervalTypes,
  intervalCount: number,
) => {
  const created = new Date(startDate);

  const year = created.getUTCFullYear();
  const month = created.getUTCMonth();
  const day = created.getUTCDate();

  const hours = created.getUTCHours();
  const minutes = created.getUTCMinutes();
  const seconds = created.getUTCSeconds();
  const milliseconds = created.getUTCMilliseconds();

  let nextDate: Date;

  switch (intervalType) {
    case IntervalTypes.Year:
      nextDate = new Date(
        Date.UTC(
          year + intervalCount,
          month,
          day,
          hours,
          minutes,
          seconds,
          milliseconds,
        ),
      );
      break;

    case IntervalTypes.Month: {
      const isOver28 = day > 28;
      const billingDay = isOver28 ? 28 : day;

      const nextMonthBase = new Date(Date.UTC(year, month + intervalCount, 1));

      nextDate = new Date(
        Date.UTC(
          nextMonthBase.getUTCFullYear(),
          nextMonthBase.getUTCMonth(),
          billingDay,
          hours,
          minutes,
          seconds,
          milliseconds,
        ),
      );
      break;
    }

    case IntervalTypes.Week:
      nextDate = new Date(
        created.getTime() + intervalCount * 7 * 24 * 60 * 60 * 1000,
      );
      break;

    case IntervalTypes.Day:
      nextDate = new Date(
        created.getTime() + intervalCount * 24 * 60 * 60 * 1000,
      );
      break;

    case IntervalTypes.Hour:
      nextDate = new Date(
        created.getTime() + intervalCount * 1 * 60 * 60 * 1000,
      );
      break;

    case IntervalTypes.None:
    default:
      nextDate = new Date(created.getTime());
      break;
  }

  return nextDate;
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const InvoiceLeadTime: Record<string, any> = {
  hour: {
    1: { minutes: 10 },
    6: { minutes: 30 },
    12: { hours: 1 },
  },
  day: {
    1: { hours: 2 },
    7: { days: 1 },
  },
  month: {
    1: { days: 3 },
    3: { days: 7 },
    12: { days: 30 },
  },
  year: {
    1: { days: 30 },
  },
} as const;

export function getInvoiceLeadTime(
  intervalType: IntervalTypes,
  intervalCount: number,
): number {
  console.log({ intervalType, intervalCount });
  const config =
    InvoiceLeadTime[IntervalTypes[intervalType].toString().toLowerCase()];

  if (!config) {
    throw new Error(
      `Unsupported interval type: ${IntervalTypes[intervalType].toString()}`,
    );
  }

  // Exact match first
  const duration = config[intervalCount as keyof typeof config];

  if (!duration) {
    throw new Error(
      `No lead time configured for ${intervalCount} ${intervalType}(s)`,
    );
  }

  if ("minutes" in duration) {
    return duration.minutes * MINUTE;
  }

  if ("hours" in duration) {
    return duration.hours * HOUR;
  }

  if ("days" in duration) {
    return duration.days * DAY;
  }

  throw new Error("Invalid lead time configuration");
}

// export const getInvoiceLeadTime = (
//   intervalType: IntervalTypes,
//   intervalCount: number,
// ) => {
//   switch (intervalType) {
//     case IntervalTypes.Hour:
//       return { minutes: Math.min(intervalCount * 10, 60) };

//     case IntervalTypes.Day:
//       return { hours: Math.min(intervalCount * 2, 24) };

//     case IntervalTypes.Month:
//       return { days: Math.min(intervalCount * 3, 14) };

//     case IntervalTypes.Year:
//       return { days: 30 };

//     default:
//       return { minutes: 10 };
//   }
// };
