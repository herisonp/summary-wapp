import { Request, Response } from "express";
import { allowedGroups } from "../configs/allowed-groups";
import { sendSummaryOnCron } from "./summary";
import { timeRangeToHibernate } from "../configs/time-range-to-hibertante";

export const cron = async (req: Request, res: Response) => {
  console.log("Executando cron job...");
  const { start, end } = timeRangeToHibernate;

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const isWithinRange =
    (currentHour > startHour ||
      (currentHour === startHour && currentMinute >= startMinute)) &&
    (currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute));

  if (isWithinRange) {
    console.log("Cron hibernando...");
    res.send("Cron hibernando...");
    return;
  }

  await Promise.all(
    allowedGroups.map(async (groupId) => {
      await sendSummaryOnCron({ groupId });
    })
  );
  console.log("Cron job executado!");
  res.send("Cron job executed!");
  return;
};
