import { ComponentPropsWithoutRef } from "react";

import { ContentsGenerationMode } from "@common/types";

import { MANUAL_CREATION_SECTION } from "./constants";
import { useLyricsContext } from "./contexts";
import { LyricsPartType, PageMetadata } from "./types";

type Props = ComponentPropsWithoutRef<"button"> & {
  className?: string;
};

const GenerationModeFlipper: React.FC<Props> = ({ className, ...props }): JSX.Element => {
  const { setLyricsParts, setPageMetadata, artist, songName, isManual, setIsManual } = useLyricsContext();

  const handleClick = () => {
    if (!isManual) {
      setLyricsParts([{ section: MANUAL_CREATION_SECTION, lyrics: "" }]);
      setPageMetadata({ id: ContentsGenerationMode.Manual, artist: artist, title: songName, contributors: [] });
    } else {
      setLyricsParts([] as LyricsPartType[]);
      setPageMetadata({} as PageMetadata);
    }
    setIsManual(!isManual);
  };

  return (
    <button type="button"
      onClick={handleClick}
      className={`mode-flipper ${className ?? ""}`}
      {...props}
    >
      { isManual ? "Generate cards automatically" : "Generate cards manually instead" }
    </button>
  )
};

export default GenerationModeFlipper;