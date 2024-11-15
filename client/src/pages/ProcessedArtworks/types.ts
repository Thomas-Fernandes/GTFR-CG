import { ApiResponse } from "@/common/types";

export type ProcessedArtworksPathResponse = ApiResponse & {
  data: {
    path: string;
  };
};

export type ThumbnailOptionProps = {
  logoPosition: string;
  idx: number;
};