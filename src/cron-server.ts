import { CronJob } from "cron";

export const job = new CronJob(
  "*/5 * * * *", // every 5 minutes
  () => {
    console.log("Running Cron Job");
    fetch("http://localhost:3000/cron");
  },
  null,
  true,
  "America/Sao_Paulo"
);
