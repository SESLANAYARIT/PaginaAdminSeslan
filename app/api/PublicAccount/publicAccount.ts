import type { DataPointCP } from "~/interfaces/PublicAccount/publicAccount";
import authenticatedClient from "../authenticatedClient";

const url = "public-account/datapoint/";

export const getPublicAccounts = (): Promise<DataPointCP[]> =>
  authenticatedClient.get(url).then((resp) => resp.data);

export const createDatapointPublicAccount = (year: number): Promise<DataPointCP[]> =>
  authenticatedClient.post(url, { year }).then((resp) => resp.data);

export const changeActivePublicAccountYear = (
  year: number,
  active: boolean
): Promise<void> =>
  authenticatedClient
    .patch(`${url}${year}`, { active })
    .then((resp) => resp.data);

export const deleteYearPublicAccount = (year: number): Promise<void> =>
  authenticatedClient.delete(`${url}${year}`).then((resp) => resp.data);
