import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

interface IThumbnailGalleryContext {
  setSelectedThumbnail: StateSetter<string>;
}
const { context: ThumbnailGalleryContext, useContext: useThumbnailGalleryContext } =
  createNewContext<IThumbnailGalleryContext>();

export { ThumbnailGalleryContext, useThumbnailGalleryContext };
