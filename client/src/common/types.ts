import { Dispatch, SetStateAction } from "react";

export type SongPartsCards = string[][];

export enum ContentsGenerationMode {
  Manual = "manual",
  Auto = "auto",
}

export type ImageDownloadRequest = Readonly<{
  selectedImage: string;
}>;

export type ApiResponse = Readonly<{
  status: number;
  message: string;
  data?: object;
}>;

export enum RestVerb {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export enum ValidationError {
  More = "Err.More",
  HorizontalOverflow = "Err.HorizontalOverflow",
  VerticalOverflow = "Err.VerticalOverflow",
}
export enum ValidationWarning {
  HorizontalOverflow = "Warn.HorizontalOverflow",
  VerticalOverflow = "Warn.VerticalOverflow",
}
export type ValidationInconvenience = {
  where: string;
  what: ValidationError | ValidationWarning;
  message?: string;
};

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict = { [key: string]: unknown };