import type {
  CreateDatapointRequest,
  DeleteDataPointRequest,
  PatchDatapointRequest,
  ResponseDatapoint,
} from "~/interfaces/Article33/types/article33.interfaces";
import authenticatedClient from "../authenticatedClient";

const url = "/articulo33/datapoint";

export const createDataPoint = (
  dataPoint: CreateDatapointRequest
): Promise<ResponseDatapoint> =>
  authenticatedClient.post(url, dataPoint).then((resp) => resp.data);

export const patchDataPoint = (
  id: string,
  dataPoint: PatchDatapointRequest
): Promise<ResponseDatapoint> =>
  authenticatedClient
    .patch(`${url}/${id}`, dataPoint)
    .then((resp) => resp.data);

export const deleteDataPoint = (
  deleteDataPointRequest: DeleteDataPointRequest
) =>
  authenticatedClient
    .delete(url, { params: deleteDataPointRequest })
    .then((resp) => resp.data);
