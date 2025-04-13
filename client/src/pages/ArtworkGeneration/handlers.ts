import { StateSetter } from "@/common/types";

import { ArtworkGenerationOption, GenerationOptionState } from "./types";

export const handleOnMouseOver = (
  generationOptions: ArtworkGenerationOption[],
  i: number,
  setter: StateSetter<GenerationOptionState>
) => {
  setter({
    current: i,
    prevLabel: i > 0 ? generationOptions[i - 1].h1 : "",
    nextLabel: i < generationOptions.length - 1 ? generationOptions[i + 1].h1 : "",
  });
};
