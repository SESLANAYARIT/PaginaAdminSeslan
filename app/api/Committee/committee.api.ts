import type {
  GetCommitteesRequest,
  GetCommitteesResponse,
  CreateCommitteeRequest,
  CreateCommitteeResponse,
  UpdateCommitteeResponse,
  DeleteCommitteeResponse,
  UpdateCommitteeRequest,
} from "~/interfaces/committe.interface";
import authenticatedClient from "../authenticatedClient";

const url = "/comite-transp";
export const getAllCommittees = (
  data: GetCommitteesRequest
): Promise<GetCommitteesResponse> =>
  authenticatedClient.get(url, { params: data }).then((resp) => resp.data);

export const createCommittee = (
  data: CreateCommitteeRequest
): Promise<CreateCommitteeResponse> =>
  authenticatedClient
    .post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const updateCommittee = (
  id: string,
  data: UpdateCommitteeRequest
): Promise<UpdateCommitteeResponse> =>
  authenticatedClient
    .patch(`${url}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const deleteCommittee = (id: string): Promise<DeleteCommitteeResponse> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
