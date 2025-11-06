import type { Section } from "~/interfaces/Article33/types/article33.types";
import authenticatedClient from "../authenticatedClient";
import type {
  CreateSectionRequest,
  CreateSubSectionRequest,
  UpdateSectionRequest,
} from "~/interfaces/Article33/types/article33.interfaces";

const url = "/articulo33/sections";
export const getAllSections = (): Promise<Section[]> =>
  authenticatedClient.get(url).then((resp) => resp.data);

export const createSection = (
  createSectionRequest: CreateSectionRequest
): Promise<Section> =>
  authenticatedClient.post(url, createSectionRequest).then((resp) => resp.data);

export const createSubSection = (
  createSubSectionRequest: CreateSubSectionRequest
): Promise<Section> =>
  authenticatedClient
    .post("/articulo33/subsections", createSubSectionRequest)
    .then((resp) => resp.data);

export const updateSection = (updateSectionRequest: UpdateSectionRequest) =>
  authenticatedClient
    .patch(`${url}/${updateSectionRequest.id}`, {
      name: updateSectionRequest.name,
    })
    .then((resp) => resp.data);

export const deleteSection = (id: string): Promise<Section> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
