import { StateSetter } from "@/common/types";
import { ArtistLinks } from "@/pages/DescriptionGeneration/types";

export interface SongPageSearchSubmitProps {
  isGenerating: boolean;
  setIsGenerating: StateSetter<boolean>;
  setFoundPage: StateSetter<string>;
  setArtistLinks: StateSetter<ArtistLinks>;
}
export interface DescriptionGenerationFormProps {
  artist: string;
  song: string;
}
