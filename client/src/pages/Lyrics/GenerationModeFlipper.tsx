import { ContentsGenerationMode } from "@/common/types";
import { useAppContext } from "@/contexts";

import { useLyricsContext } from "./contexts";
import { GenerationModeFlipperProps, LyricsPartType, PageMetadata } from "./types";

const GenerationModeFlipper = ({ className, ...props }: GenerationModeFlipperProps) => {
  const { intl } = useAppContext();
  const labels = {
    switchManual: intl.formatMessage({ id: "pages.lyrics.generationMode.switchManual" }),
    switchAutomatic: intl.formatMessage({ id: "pages.lyrics.generationMode.switchAutomatic" }),
    manualHeader: intl.formatMessage({ id: "pages.lyrics.parts.manualHeader" }),
  };

  const { setLyricsParts, setPageMetadata, artist, songName, isManual, setIsManual } = useLyricsContext();

  const handleClick = () => {
    if (!isManual) {
      setLyricsParts([{ section: labels.manualHeader, lyrics: "" }]);
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
      className={`large mac ${className ?? ""}`}
      {...props}
    >
      { isManual ? labels.switchAutomatic : labels.switchManual }
    </button>
  )
};

export default GenerationModeFlipper;