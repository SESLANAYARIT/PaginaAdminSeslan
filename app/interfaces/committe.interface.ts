// --- Base entity ---
export interface Committee {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  file: string;
}

// --- Form data (para formularios en frontend) ---
export interface CommitteeForm {
  title: string;
  description: string;
  date: string;
  file: string | File | Blob;
}

export interface CommitteeFormUpdate {
  title: string;
  description: string;
  date: string;
  file?: string | File | Blob;
}

// --- Requests ---

// Obtener varios comités (GET /)
export interface GetCommitteesRequest {
  perPage: number;
  page: number;
  search?: string;
}

// Crear comité (POST)
export interface CreateCommitteeRequest {
  title: string;
  description: string;
  date: string;
  file: string | File | Blob;
}

// Actualizar comité (PUT/PATCH)
export interface UpdateCommitteeRequest {
  title: string;
  description: string;
  date: string;
  file?: string | File | Blob;
}

// --- Responses ---

// Respuesta al obtener varios comités (GET /)
export interface GetCommitteesResponse {
  docTransparencia: Committee[];
  total: number;
}

// Respuesta al crear comité (POST)
export interface CreateCommitteeResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  file: string;
}

// Respuesta al actualizar comité (PUT/PATCH)
export interface UpdateCommitteeResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  file: string;
}

// Respuesta al eliminar comité (DELETE)
export interface DeleteCommitteeResponse {
  message?: string;
}
