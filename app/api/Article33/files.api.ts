import type { FileData } from "~/interfaces/Article33/types/article33.types";
import authenticatedClient from "../authenticatedClient";
import type { CreateFilesRequest } from "~/interfaces/Article33/types/article33.interfaces";

const url = "/articulo33/file";

export const createFile = (
  createFilesRequest: CreateFilesRequest,
  file: FormData
): Promise<FileData> =>
  authenticatedClient
    .post(url, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: createFilesRequest,
    })
    .then((resp) => resp.data);

    export const deleteFile = (id:string)=>
    authenticatedClient
    .delete(`${url}/${id}`)
    .then((resp) => resp.data);