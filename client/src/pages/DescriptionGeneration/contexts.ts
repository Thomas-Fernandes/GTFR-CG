import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

import { ArtistLinks } from "./types";

interface IDescriptionGenerationContext {
  setFoundPage: StateSetter<string>;
  setArtistLinks: StateSetter<ArtistLinks>;
}
const { context: DescriptionGenerationContext, useContext: useDescriptionGenerationContext } =
  createNewContext<IDescriptionGenerationContext>();

export { DescriptionGenerationContext, useDescriptionGenerationContext };
