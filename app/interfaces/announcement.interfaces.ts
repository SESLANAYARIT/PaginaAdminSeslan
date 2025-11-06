export interface AnnouncementInterface {
  id: string;
  title: string;
  description: string;
  date: string;
  file: string;
}

export interface AnnouncementForm {
  title: string;
  description: string;
  date: string;
  file: string | File | Blob;
}

export interface AnnouncementFormUpdate {
  title: string;
  description: string;
  date: string;
  file?: string | File | Blob ;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  file: string;
}

// --- Requests ---

// Obtener varios anuncios (GET /)
export interface GetAnnouncementsRequest {
  perPage: number;
  page: number;
  search?: string;
}

// Crear anuncio (POST)
export interface CreateAnnouncementRequest {
  title: string;
  description: string;
  date: string; // ISO string
  file: File; // archivo subido
}

// Actualizar anuncio (PUT/PATCH)
export interface UpdateAnnouncementRequest {
  title?: string;
  description?: string;
  date?: string; // ISO string
  file?: File; // archivo subido
}

// --- Responses ---

// Respuesta al obtener varios anuncios (GET /)
export interface GetAnnouncementsResponse {
  announcements: Announcement[];
  total: number;
}

// Respuesta al crear anuncio (POST)
export interface CreateAnnouncementResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  file: string;
}

// Respuesta al actualizar anuncio (PUT/PATCH)
export interface UpdateAnnouncementResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  file: string;
}

// Respuesta al eliminar anuncio (DELETE)
export interface DeleteAnnouncementResponse {}
