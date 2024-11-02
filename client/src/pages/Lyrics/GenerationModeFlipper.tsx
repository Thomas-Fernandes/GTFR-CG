
import { LyricsPartType, PageMetadata } from "@common/types";

import { useLyricsContext } from "./context";

const GenerationModeFlipper = (): JSX.Element => {
  const { setLyricsParts, setPageMetadata, artist, songName, isManual, setIsManual } = useLyricsContext();

  const handleClick = () => {
    if (!isManual) {
      setLyricsParts([{section: "Manual Card Creation", lyrics: ""}]);
      setPageMetadata({id: "manual", artist: artist, title: songName, contributors: []});
    } else {
      setLyricsParts([] as LyricsPartType[]);
      setPageMetadata({} as PageMetadata);
    }
    setIsManual(!isManual);
  };

  return (
    <button type="button" onClick={handleClick} className="mode-flipper">
      { isManual ? "Generate cards automatically" : "Generate cards manually instead" }
    </button>
  )
};

export default GenerationModeFlipper;