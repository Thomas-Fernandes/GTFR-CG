import { createNewContext } from "../../common/ContextProvider";
import { StateSetter } from "../../common/Types";

export interface ProcessedImagesContextType {
  selectedThumbnail: string;
  setSelectedThumbnail: StateSetter<string>;
}

const { context: ProcessedImagesContext, useContext: useProcessedImagesContext } = createNewContext<ProcessedImagesContextType>();

export { ProcessedImagesContext, useProcessedImagesContext };
