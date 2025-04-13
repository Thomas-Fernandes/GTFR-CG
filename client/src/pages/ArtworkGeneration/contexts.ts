import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

interface IArtworkGenerationContext {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}
const { context: ArtworkGenerationContext, useContext: useArtworkGenerationContext } =
  createNewContext<IArtworkGenerationContext>();

export { ArtworkGenerationContext, useArtworkGenerationContext };
