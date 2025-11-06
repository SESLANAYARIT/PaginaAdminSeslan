import type {
    NormativityInterface,
  NormativityResponse,
  NormativitySearchParams,
} from "~/interfaces/normativity.interfaces";
import authenticatedClient from "../authenticatedClient";
import qs from "qs";
import type { NormativityForm } from "~/schemas/normativity.schema";

const url = "normativity";

export const getAllNormativities = (
  params: NormativitySearchParams
): Promise<NormativityResponse> =>
  authenticatedClient
    .get(url, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
    .then((resp) => resp.data);

export const createNormativity = (
  data: NormativityForm
): Promise<NormativityInterface> =>
  authenticatedClient
    .post(url, data, { headers: { "Content-Type": "multipart/form-data" } })
    .then((resp) => resp.data);

export const updateNormativity = (
  id: string,
  data: NormativityForm
): Promise<NormativityInterface> =>
  authenticatedClient
    .patch(`${url}/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
    .then((resp) => resp.data);

export const deleteNormativity = (id: string): Promise<void> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
