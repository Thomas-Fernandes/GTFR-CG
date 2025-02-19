import { Dispatch, SetStateAction } from "react";

export enum ContentsGenerationMode {
  Manual = "manual",
  Auto = "auto",
}

export type SongPartsCards = string[][];

export type ImageDownloadRequest = Readonly<{
  selectedImage: string;
}>;

export type ApiResponse = Readonly<{
  status: number;
  message: string;
  data?: Record<string, unknown>;
}>;

export enum RestVerb {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict = { [key: string]: unknown };