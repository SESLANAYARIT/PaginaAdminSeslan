import type {
  GetAllCarrousel,
  GetAllCarrouselResponse,
  ItemCarrousel,
} from "~/interfaces/carrousel.interfaces";
import authenticatedClient from "../authenticatedClient";
import type { carrouselSchema } from "~/schemas/carrousel.schema";
import { z } from "zod";
type CarrouselFormData = z.infer<typeof carrouselSchema>;

export const getAllCarrousel = (
  data: GetAllCarrousel
): Promise<GetAllCarrouselResponse> =>
  authenticatedClient
    .get("/principal/carrouselAll", { params: data })
    .then((resp) => resp.data);

export const updateCarrousel = (
  id: string,
  data: CarrouselFormData
): Promise<ItemCarrousel> =>
  authenticatedClient
    .patch(`/principal/carrousel/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const createCarrousel = (data: FormData): Promise<ItemCarrousel> =>
  authenticatedClient
    .post("/principal/carrousel", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const deleteCarrousel = (id: string): Promise<ItemCarrousel> =>
  authenticatedClient.delete(`/principal/carrousel/${id}`).then((resp) => resp.data);
