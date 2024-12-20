import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

interface ArtworkGenerationContextType {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}
const {
  context: ArtworkGenerationContext,
  useContext: useArtworkGenerationContext
} = createNewContext<ArtworkGenerationContextType>();

export { ArtworkGenerationContext, useArtworkGenerationContext };

