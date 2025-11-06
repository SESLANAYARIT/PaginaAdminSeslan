import type { FileData } from "./article33.types";

export interface Articulo33SectionForm {
  name: string;
}
// --- Requests Sections ---
export interface CreateSectionRequest {
  name: string;
}
export interface CreateSubSectionRequest {
  name: string;
  parentId: string;
}

export interface UpdateSectionRequest {
  name: string;
  id: string;
}

// --- Request dataPoints ---
export interface CreateDatapointRequest {
  year: number;
  sectionId: string;
  frequency: string;
}

export interface PatchDatapointRequest {
  year: number;
  active: boolean;
}

export interface DeleteDataPointRequest {
  sectionId: string;
  year: number;
}

export interface ResponseDatapoint {
  id: string;
  year: number;
  period: string;
  sectionId: string;
  active: boolean;
  fileId: FileData | null;
}

export interface CreateFilesRequest {
  sectionId: string;
  year: number;
  period: string;
}
