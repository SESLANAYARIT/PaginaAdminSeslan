import type {
  RequestGetSessions,
  ResponseGetSessions,
  SessionInterface,
} from "~/interfaces/sessions.interfaces";
import authenticatedClient from "../authenticatedClient";
import qs from "qs";
import { id } from "zod/v4/locales";

const url = "sessions";

export const getAllSessions = (
  data: RequestGetSessions
): Promise<ResponseGetSessions> =>
  authenticatedClient
    .get(url, {
      params: data,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
    .then((resp) => resp.data);

export const createSession = (data: FormData): Promise<SessionInterface> =>
  authenticatedClient
    .post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const updateSession = (
  id: string,
  data: FormData
): Promise<SessionInterface> =>
  authenticatedClient
    .patch(`${url}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const deleteSession = (id:string) =>
  authenticatedClient
    .delete(`${url}/${id}`)
    .then((resp) => resp.data);

