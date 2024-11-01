import { createNewContext } from "@common/contextProvider";
import { StateSetter } from "@common/types";

export interface ProcessedArtworksContextType {
  selectedThumbnail: string;
  setSelectedThumbnail: StateSetter<string>;
}

const { context: ProcessedArtworksContext, useContext: useProcessedArtworksContext } = createNewContext<ProcessedArtworksContextType>();

export { ProcessedArtworksContext, useProcessedArtworksContext };

