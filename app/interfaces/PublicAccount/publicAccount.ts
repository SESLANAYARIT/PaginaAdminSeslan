export type FileDataCP = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
};

export type DataPointCP = {
  year: number;
  period: "ANUAL" | "Q1" | "Q2" | "Q3" | "Q4";
  active: boolean;
  fileData?: FileDataCP;
};


export interface createPAFile {
  year: number;
  period : "ANUAL" | "Q1" | "Q2" | "Q3" | "Q4";
}