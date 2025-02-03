import { summaryConfig } from "../summary.conf";

export const timeRangeToHibernate = {
  start: summaryConfig.timeRangeToHibernate.start || "01:00",
  end: summaryConfig.timeRangeToHibernate.end || "06:00",
};
