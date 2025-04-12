import { ApiResponse } from "@/common/types";

export interface GeniusTokenResponse extends ApiResponse {
  data: {
    token: string;
  }
}