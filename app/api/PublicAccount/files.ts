import type {
  createPAFile,
  FileDataCP,
} from "~/interfaces/PublicAccount/publicAccount";
import authenticatedClient from "../authenticatedClient";

const url = "public-account/file";

export const uploadFilePA = (
  data: createPAFile,
  file: FormData
): Promise<FileDataCP> =>
  authenticatedClient
    .post(url, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: data,
    })
    .then((resp) => resp.data);

export const deleteFilePA = (id: string): Promise<void> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
