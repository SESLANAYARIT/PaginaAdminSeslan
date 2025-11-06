import type {
  DocumentForm,
  DocumentInterface,
  RequestGetDocuments,
  ResponseGetDocuments,
} from "~/interfaces/documents/document.interfaces";
import authenticatedClient from "../authenticatedClient";
import qs from "qs";

const url = "document";

export const getAllDocuments = (
  data: RequestGetDocuments
): Promise<ResponseGetDocuments> =>
  authenticatedClient
    .get(url, {
      params: data,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
    .then((resp) => resp.data);

export const createDocument = (
  data: DocumentForm
): Promise<DocumentInterface> =>
  authenticatedClient
    .post(url, data, { headers: { "Content-Type": "multipart/form-data" } })
    .then((resp) => resp.data);

export const updateDocument = (
  id: string,
  data: DocumentForm
): Promise<DocumentInterface> =>
  authenticatedClient
    .patch(`${url}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((resp) => resp.data);

export const deleteDocument = (id: string): Promise<void> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
