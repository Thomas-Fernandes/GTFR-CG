import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "@/common/contextProvider";
import { StateSetter } from "@/common/types";

export interface ArtworkGenerationContextType {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}

const { context: ArtworkGenerationContext, useContext: useArtworkGenerationContext } = createNewContext<ArtworkGenerationContextType>();

export { ArtworkGenerationContext, useArtworkGenerationContext };

