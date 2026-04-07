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

    case IntervalTypes.None:
    default:
      nextDate = new Date(created.getTime());
      break;
  }

  return nextDate;
};
