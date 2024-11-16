import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

interface ThumbnailGalleryContextType {
  setSelectedThumbnail: StateSetter<string>;
}
const {
  context: ThumbnailGalleryContext,
  useContext: useThumbnailGalleryContext
} = createNewContext<ThumbnailGalleryContextType>();

export { ThumbnailGalleryContext, useThumbnailGalleryContext };

