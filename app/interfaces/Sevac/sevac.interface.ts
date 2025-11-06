import type { FileData } from "../Article33/types/article33.types";

export interface SevacDatapoint {
  id: string;
  year: number;
  active: boolean;
  period: Period;
  fileId: string;
  fileData: FileData;
}

export interface ResponseSevacDatapoint {
  datapoints: SevacDatapoint[];
  years: number[];
}

export interface RequestCreateSevacDatapoint {
  year: number;
}

export interface RequestCreateSevacFile {
  year: number;
  period: Period;
}

type Period = "Q1" | "Q2" | "Q3" | "Q4";
