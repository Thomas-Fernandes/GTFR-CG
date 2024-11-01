import { createNewContext } from "@/common/contextProvider";
import { StateSetter } from "@/common/types";

export interface ProcessedImagesContextType {
  selectedThumbnail: string;
  setSelectedThumbnail: StateSetter<string>;
}

const { context: ProcessedImagesContext, useContext: useProcessedImagesContext } = createNewContext<ProcessedImagesContextType>();

export { ProcessedImagesContext, useProcessedImagesContext };

