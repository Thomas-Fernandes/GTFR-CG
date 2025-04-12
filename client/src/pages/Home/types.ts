import { ApiResponse } from "@/common/types";

export type GeniusTokenResponse = ApiResponse & Readonly<{
  data: {
    token: string;
  }
}>;