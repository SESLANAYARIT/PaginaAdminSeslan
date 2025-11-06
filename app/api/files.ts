import publicClient from "./publicClient";

const urlBase = "files";

export const getUrlS3 = (url: string): Promise<string> =>
  publicClient.get(`${urlBase}/s3-url-v2/${url}`).then((resp) => resp.data);

export const DownloadUrlS3 = (url: string): Promise<Blob> =>
  publicClient.get(`${urlBase}/s3/${url}`).then((resp) => resp.data);
