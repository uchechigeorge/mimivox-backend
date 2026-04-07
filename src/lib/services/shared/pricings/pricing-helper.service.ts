import { $Enums } from "@/generated/prisma/client";
import { IntervalTypes } from "@/lib/data/IntervalTypes";

export const toAppIntervalType = (s: $Enums.IntervalType): IntervalTypes => {
  switch (s) {
    case "None":
      return IntervalTypes.None;
    case "Year":
      return IntervalTypes.Year;
    case "Month":
      return IntervalTypes.Month;
    case "Week":
      return IntervalTypes.Week;
    case "Day":
      return IntervalTypes.Day;
    default:
      return IntervalTypes.None;
  }
};
