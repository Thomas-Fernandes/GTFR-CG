import { Dispatch, SetStateAction } from "react";

export type SongPartsCards = string[][];

export enum ContentsGenerationMode {
  Manual = "manual",
  Auto = "auto",
}

export interface ImageDownloadRequest {
  selectedImage: string;
}

export interface ApiResponse {
  status: number;
  message: string;
  data?: Dict<unknown>;
}

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
export interface ValidationInconvenience {
  where: string;
  what: ValidationError | ValidationWarning;
  message?: string;
}

export type Locale = "en" | "fr";

export interface Option {
  label: string;
  value: string;
}
export type LocaleOptionType = Option & {
  value: Locale;
};

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict<T> = Record<string, T>;
