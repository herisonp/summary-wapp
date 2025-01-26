import { intervalSummary } from "../configs/interval-summary";

export const getDateRange = (date?: Date | string) => {
  const today = new Date(date || Date.now());
  const startDate = new Date(today.getTime() - intervalSummary);
  const endDate = new Date(today);
  const startDateUTC = Math.floor(
    new Date(new Date(startDate).toUTCString()).getTime() / 1000
  );
  const endDateUTC = Math.floor(
    new Date(new Date(endDate).toUTCString()).getTime() / 1000
  );

  return {
    startDate: startDateUTC,
    endDate: endDateUTC,
  };
};
