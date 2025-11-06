export enum NewsCategory {
  COMITE_COORDINADOR = "COMITE_COORDINADOR",
  SECRETARIA_EJECUTIVA = "SECRETARIA_EJECUTIVA",
  POLITICA_ESTATAL_ANTICORRUPCION = "POLITICA_ESTATAL_ANTICORRUPCION",
  EVENTOS = "EVENTOS",
  CAPACITACIONES = "CAPACITACIONES",
  SISTEMA_LOCAL_ANTICORRUPCION = "SISTEMA_LOCAL_ANTICORRUPCION",
}

export enum NewsStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export const NewsStatusLabels: Record<NewsStatus, string> = {
  [NewsStatus.DRAFT]: "Borrador",
  [NewsStatus.PUBLISHED]: "Publicado",
  [NewsStatus.ARCHIVED]: "Archivado",
};

export const NewsCategoryLabels: Record<NewsCategory, string> = {
  [NewsCategory.COMITE_COORDINADOR]: "Comite Coordinador",
  [NewsCategory.SECRETARIA_EJECUTIVA]: "Secretaria Ejecutiva",
  [NewsCategory.POLITICA_ESTATAL_ANTICORRUPCION]: "Politica Estatal Anticorrupción",
  [NewsCategory.EVENTOS]: "Eventos",
  [NewsCategory.CAPACITACIONES]: "Capacitaciones",
  [NewsCategory.SISTEMA_LOCAL_ANTICORRUPCION]: "Sistema Local Anticorrupción",
};

export interface NewsInterface {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishDate: string;
  content: string;
  featured: boolean;
  status: NewsStatus;
  tags: string[];
  file: string;
}

export interface NewsForm {
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishDate: string;
  content: string;
  featured: boolean;
  status: NewsStatus;
  tags: string[];
  file?: string | File | undefined | Blob;
}

export interface News {
  id?: string;
  title?: string;
  excerpt?: string;
  category?: NewsCategory;
  publishDate?: string;
  content?: string;
  featured?: boolean;
  status?: string;
  tags?: string[];
  file?: string; // Puede ser URL o nombre de archivo
}

/**
 * Payload para crear una noticia (POST)
 */
export interface NewsCreate {
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishDate: string; // ISO string
  content: string;
  featured?: boolean; // por defecto false
  status?: string; // por defecto "draft"
  tags: string[]; // mínimo 1
  file: File; // archivo de imagen o recurso
}

/**
 * Payload para actualizar una noticia (PATCH)
 */
export interface NewsUpdate {
  title?: string;
  excerpt?: string;
  category?: NewsCategory;
  publishDate?: string; // ISO string
  content?: string;
  featured?: boolean; // por defecto false
  status?: string; // por defecto "draft"
  tags?: string[]; // mínimo 1
  file?: File; // archivo de imagen o recurso
}

/**
 * Payload para eliminar una noticia (DELETE)
 */
export interface NewsDelete {
  id: string;
}

/**
 * Respuesta al obtener una sola noticia (GET /news/:id)
 */
export interface NewsResponse {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishDate: string; // En frontend conviene manejarlo como string ISO
  content: string;
  featured: boolean;
  status: string;
  tags: string[];
  file: string; // Puede ser URL o nombre de archivo
}

/**
 * Respuesta al obtener lista de noticias (GET /news)
 */
export interface NewsListResponse {
  news: NewsInterface[];
  total: number; // total de registros
}

/*Data GetAllNews* */
export interface GetAllNews {
  page: number;
  perPage: number;
  search: string;
  statusNews?: NewsStatus;
  featured?: string;
}
