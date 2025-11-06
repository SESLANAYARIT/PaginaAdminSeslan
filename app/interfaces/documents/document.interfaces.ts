export type FileData = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
};

export enum Area {
  CC = "CC", // Comité Coordinador
  OG = "OG", // Órgano de Gobierno
  CE = "CE", // Comisión Ejecutiva
  SEIP = "SEIP", // Secretaría Ejecutiva Informes y Programas
  CET = "CET", // Comité de Ética
  CON = "CON", // Convenios
}

export enum Topico {
  CONVENIO = "CONVENIO",
  CC = "CC",
  SLF = "SLF", // Sistema Local de Fiscalización
  PP = "PP", // Planes y Programas
  INFORMES = "INFORMES",
  NORMAS = "NORMAS",
}

// Labels para mostrar en la UI
export const AreaLabels = {
  [Area.CC]: "Comité Coordinador",
  [Area.OG]: "Órgano de Gobierno",
  [Area.CE]: "Comisión Ejecutiva",
  [Area.SEIP]: "Secretaría Ejecutiva Informes y Programas",
  [Area.CET]: "Comité de Ética",
  [Area.CON]: "Convenios",
};

export const TopicoLabels = {
  [Topico.CONVENIO]: "Convenio",
  [Topico.SLF]: "Sistema Local de Fiscalización",
  [Topico.PP]: "Planes y Programas",
  [Topico.INFORMES]: "Informes",
  [Topico.NORMAS]: "Normas",
  [Topico.CC]: "Carta Compromiso",
};

export interface DocumentForm {
  title: string;
  description: string;
  documentDate: string;
  area: Area | "";
  topico: Topico | "";
  active?: boolean;
  file?: File | null;
}

export interface DocumentInterface {
  id: string;
  title: string;
  description: string;
  documentDate: string;
  area: Area;
  topico: Topico;
  active: boolean;
  fileData: FileData; // Información del archivo desde el servidor
  createdAt: string;
  updatedAt: string;
}

export interface RequestGetDocuments {
  perPage?: number;
  page?: number;
  search?: string;
  area?: Area[];
  topico?: Topico[];
  active?: boolean;
}

export interface ResponseGetDocuments {
  documents: DocumentInterface[];
  total: number;
}


