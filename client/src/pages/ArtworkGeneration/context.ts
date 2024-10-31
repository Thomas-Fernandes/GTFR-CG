import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "../../common/ContextProvider";
import { StateSetter } from "../../common/Types";

export interface ArtworkGenerationContextType {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}

const { context: ArtworkGenerationContext, useContext: useArtworkGenerationContext } = createNewContext<ArtworkGenerationContextType>();

export { ArtworkGenerationContext, useArtworkGenerationContext };

