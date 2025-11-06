import type { GetAllNews, NewsForm, NewsInterface, NewsListResponse } from "~/interfaces/news.interfaces";
import authenticatedClient from "../authenticatedClient";

export const getAllNews = (data: GetAllNews): Promise<NewsListResponse> =>
    authenticatedClient
        .get("/news", { params: data })
        .then((resp) => resp.data);

export const createNews = (data:NewsForm): Promise<NewsInterface> =>
    authenticatedClient
        .post("/news", data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((resp) => resp.data);

export const updateNews = (id: string, data: NewsForm): Promise<NewsInterface> =>
    authenticatedClient
        .patch(`/news/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((resp) => resp.data);

export const deleteNews = (id: string): Promise<NewsInterface> =>
    authenticatedClient
        .delete(`/news/${id}`)
        .then((resp) => resp.data);