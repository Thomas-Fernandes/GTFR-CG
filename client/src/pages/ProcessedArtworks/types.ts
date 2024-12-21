import { ApiResponse } from "@/common/types";

export type ProcessedArtworksPathResponse = ApiResponse & Readonly<{
  data: {
    path: string;
  };
}>;

export type ThumbnailOptionProps = Readonly<{
  logoPosition: string;
  idx: number;
}>;