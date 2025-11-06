export type FileData = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string; // URL para descarga
};

export type DataPoint = {
  year: number;
  period: string; // "ANUAL", "S1", "S2", "Q1", "Q2", "Q3", "Q4", "B1", "B2", "B3", "B4", "B5", "B6"
  file?: FileData; // Un archivo por período
  active?: boolean; // Estado activo/inactivo del año
};

export type Section = {
  id: string;
  name: string;
  data: DataPoint[];
  subsections?: Section[]; // Sub-secciones anidadas
  parentId?: string; // ID de la sección padre
};

export type FrequencyType = "ANUAL" | "SEMESTRAL" | "TRIMESTRAL" | "BIMESTRAL";

export const FREQUENCY_PERIODS: Record<FrequencyType, string[]> = {
  ANUAL: ["ANUAL"],
  SEMESTRAL: ["S1", "S2"],
  TRIMESTRAL: ["Q1", "Q2", "Q3", "Q4"],
  BIMESTRAL: ["B1", "B2", "B3", "B4", "B5", "B6"],
};

export const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  ANUAL: "Anual",
  SEMESTRAL: "Semestral",
  TRIMESTRAL: "Trimestral",
  BIMESTRAL: "Bimestral",
};
