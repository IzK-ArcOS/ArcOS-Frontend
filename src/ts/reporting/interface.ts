import type { Record } from "pocketbase";

export interface Report {
  author?: string;
  body: string;
  version: string;
  log: string;
  userdata?: object;
  api?: string;
}

export type ReportRecord = Report & Record;

export interface ReportOptions {
  includeUserData: boolean;
  includeApi: boolean;
  body: string;
}

export const defaultReportOptions: ReportOptions = {
  includeApi: true,
  includeUserData: false,
  body: "(Auto-generated report, no user input provided)",
};
