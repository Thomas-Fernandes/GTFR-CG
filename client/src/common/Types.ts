import { Dispatch, SetStateAction } from "react";

export type SongPartsCards = string[][];

export type ImageDownloadRequest = {
  selectedImage: string;
};

export type ApiResponse = {
  status: number;
  message: string;
  data?: object;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ResponseStatus = "info" | "success" | "warn" | "error";
export type ToastType = "info" | "success" | "warn" | "error";

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict = { [key: string]: unknown };