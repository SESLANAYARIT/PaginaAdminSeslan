export interface GetAllCarrousel {
  perPage: number;
  page: number;
  search: string;
  status: string;
  dateFilter: string;
}

export interface GetAllCarrouselResponse {
  items: ItemCarrousel[];
  count: number;
}

export interface ItemCarrousel {
  id: string;
  title: string;
  description: string;
  file: string ;
  link: string;
  active: boolean;
  order: number;
  startDate: string;
  endDate: string;
}

export interface CarrouselForm {
  title: string;
  description: string;
  file?: string | File | undefined | Blob;
  link: string;
  active: boolean;
  order: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCarrousel {
  title: string;
  description: string;
  file: string | File | null;
  link: string;
  active: boolean;
  order: number;
  startDate: string;
  endDate: string;
}
