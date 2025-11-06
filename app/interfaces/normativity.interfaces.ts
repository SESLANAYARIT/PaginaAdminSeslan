// Enum para tipos de normatividad
export enum TipoNormatividad {
  INTERNACIONAL = "INTERNACIONAL",
  NACIONAL = "NACIONAL",
  ESTATAL = "ESTATAL",
  INTERNA = "INTERNA"
}

// Etiquetas para mostrar en la interfaz
export const TipoNormatividadLabels: Record<TipoNormatividad, string> = {
  [TipoNormatividad.INTERNACIONAL]: "Internacional",
  [TipoNormatividad.NACIONAL]: "Nacional",
  [TipoNormatividad.ESTATAL]: "Estatal",
  [TipoNormatividad.INTERNA]: "Interna"
};

// Interface para los datos del archivo
export interface FileData {
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadDate?: string;
}

// Interface principal del documento
export interface NormativityInterface {
  id: string;
  title: string;
  description?: string;
  documentDate: string;
  tipoNormatividad: TipoNormatividad;
  active: boolean;
  fileData?: FileData;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para el formulario (lo que se envía al backend)
export interface NormativityForm {
  title: string;
  description?: string;
  documentDate: string;
  tipoNormatividad: TipoNormatividad | "";
  active: boolean;
  file: File | null;
}

// Interface para los parámetros de búsqueda/filtros
export interface NormativitySearchParams {
  perPage?: number;
  page?: number;
  search?: string;
  tipoNormatividad?: TipoNormatividad[];
  active?: boolean;
}

// Interface para la respuesta de la API
export interface NormativityResponse {
  normativities: NormativityInterface[];
  total: number;
}