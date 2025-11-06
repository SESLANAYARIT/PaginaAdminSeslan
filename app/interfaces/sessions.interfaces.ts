export type FileData = {
  id?: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
  file?: File;
};

export enum CommitteeType {
  CC = "CC",
  OG = "OG",
  CE = "CE",
  CET = "CET",
  CT = "CT",
  SLF = "SLF",
  SA = "SA",
}

export const CommitteeLabels: Record<CommitteeType, string> = {
  [CommitteeType.CC]: "Comité Coordinador",
  [CommitteeType.OG]: "Órgano de Gobierno",
  [CommitteeType.CE]: "Comisión Ejecutiva",
  [CommitteeType.CET]: "Comité de Ética",
  [CommitteeType.CT]: "Comité de Transparencia",
  [CommitteeType.SLF]: "Sistema Local de Fiscalización",
  [CommitteeType.SA]: "Sistema de Archivos",
};

export interface SessionInterface {
  id: string;
  name: string;
  date: string; // ISO string
  committee: CommitteeType;
  acuerdos: FileData[];
  actas: FileData[];
  documentosAdicionales: FileData[];
  createdAt: string; // ISO string
}

export interface SessionForm {
  name: string;
  date: string;
  committee: CommitteeType;
  acuerdos?: FileData[];
  actas?: FileData[];
  documentosAdicionales?: FileData[];
}

// Interfaz para el payload de actualización que incluye archivos eliminados
export interface SessionUpdatePayload extends SessionForm {
  deletedFileIds?: string[]; // IDs de archivos a eliminar
}

export interface RequestGetSessions {
  perPage?: number;
  page?: number;
  search?: string;
  committee?: CommitteeType[];
}


export interface ResponseGetSessions {
  sessions: SessionInterface[];
  total: number;
}

export interface RequestCreateSession {
    name: string;
    date: string;
    committee: CommitteeType;
    acuerdos?: File[] ;
    actas?: File[];
    documentosAdicionales?: File[];
}
