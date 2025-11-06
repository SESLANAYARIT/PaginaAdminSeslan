import type {
  AnnouncementForm,
  AnnouncementFormUpdate,
  CreateAnnouncementResponse,
  DeleteAnnouncementResponse,
  GetAnnouncementsRequest,
  GetAnnouncementsResponse,
  UpdateAnnouncementResponse,
} from "~/interfaces/announcement.interfaces";
import authenticatedClient from "../authenticatedClient";

const url = "/announcement";
export const getAllAnnouncements = (
  data: GetAnnouncementsRequest
): Promise<GetAnnouncementsResponse> =>
  authenticatedClient.get(url, { params: data }).then((resp) => resp.data);

export const createAnnouncement = (
  data: AnnouncementForm
): Promise<CreateAnnouncementResponse> =>
  authenticatedClient
    .post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const updateAnnouncement = (
  id: string,
  data: AnnouncementFormUpdate
): Promise<UpdateAnnouncementResponse> =>
  authenticatedClient
    .patch(`${url}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => resp.data);

export const deleteAnnouncement = (id: string): Promise<DeleteAnnouncementResponse> =>
  authenticatedClient.delete(`${url}/${id}`).then((resp) => resp.data);
