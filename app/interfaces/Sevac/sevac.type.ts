import type { FileData } from "../Article33/types/article33.types";

export type SevacDataPoint = {
  year: number;
  active: boolean;
  fileData: FileData;
  period: "Q1" | "Q2" | "Q3" | "Q4"
};
