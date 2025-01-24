export const getDateRange = (date?: Date | string) => {
  const today = new Date(date || Date.now());
  const startDate = new Date(today).setHours(0, 0, 0, 0);
  const endDate = new Date(today).setHours(23, 59, 59, 999);
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
