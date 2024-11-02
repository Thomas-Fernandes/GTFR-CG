import { ApiResponse } from "@common/types";

export type ProcessedImagesPathResponse = ApiResponse & {
  data: {
    path: string;
  };
};
