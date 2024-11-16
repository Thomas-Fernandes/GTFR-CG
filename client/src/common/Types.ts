import { Dispatch, SetStateAction } from "react";

export enum ContentsGenerationMode {
  Manual = "manual",
  Auto = "auto",
}

export type SongPartsCards = string[][];

export type ImageDownloadRequest = {
  selectedImage: string;
};

export type ApiResponse = {
  status: number;
  message: string;
  data?: object;
};

export enum RestVerb {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}
export type RestVerbType = `${RestVerb}`;

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict = { [key: string]: unknown };