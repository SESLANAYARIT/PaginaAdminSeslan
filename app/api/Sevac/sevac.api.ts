import type {
  RequestCreateSevacDatapoint,
  RequestCreateSevacFile,
  ResponseSevacDatapoint,
} from "~/interfaces/Sevac/sevac.interface";
import authenticatedClient from "../authenticatedClient";
import type { FileData } from "~/interfaces/Article33/types/article33.types";

const url = "sevac";

export const getSevacDataPoints = (): Promise<ResponseSevacDatapoint> =>
  authenticatedClient.get(url).then((resp) => resp.data);

export const createSevacDataPoint = (req: RequestCreateSevacDatapoint) =>
  authenticatedClient.post(url, req).then((resp) => resp.data);

export const deleteSevacYear = (year: number) =>
  authenticatedClient.delete(`${url}/${year}`).then((resp) => resp.data);

/*----------------------FILE---------------------* */

export const createSevacFile = (
  data: RequestCreateSevacFile,
  file: FormData
): Promise<FileData> =>
  authenticatedClient
    .post(`${url}/file`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: data,
    })
    .then((resp) => resp.data);


export const deleteSevacFile = (id: string): Promise<void> =>
  authenticatedClient.delete(`${url}/file/${id}`).then((resp) => resp.data);
