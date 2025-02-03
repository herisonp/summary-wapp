import { CronJob } from "cron";

// "0 */2 * * *", 2 hours
// "*/2 * * * * *", 2 seconds
export const job = new CronJob(
  "0 */2 * * *",
  () => {
    console.log("Running Cron Job");
    fetch("http://localhost:3000/cron");
  },
  null,
  true,
  "America/Sao_Paulo"
);
