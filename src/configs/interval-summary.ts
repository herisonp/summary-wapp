import { summaryConfig } from "../summary.conf";

const intervalDefault = 2 * 60 * 60 * 1000; // 2 horas
export const intervalSummary = summaryConfig.interval || intervalDefault;
