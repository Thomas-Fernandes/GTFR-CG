import { useEffect, useState } from "react";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea/AutoResizeTextarea";
import { useAppContext } from "@/contexts";
import { useLyricsContext } from "@/pages/Lyrics/contexts";

import { handleRestorePart, handleSetDismissedParts, handleSetLyricsParts } from "./handlers";
import { LyricsPartProps } from "./types";

import "./LyricsPart.scss";

const LyricsPart = ({ part, idx }: LyricsPartProps) => {
  const { intl } = useAppContext();
  const labels = {
    remove: intl.formatMessage({ id: "pages.lyrics.parts.remove" }),
    clear: intl.formatMessage({ id: "pages.lyrics.parts.clear" }),
    restore: intl.formatMessage({ id: "pages.lyrics.parts.restore" }),
  };

  const { isManual, dismissedParts, setDismissedParts, lyricsParts, setLyricsParts } = useLyricsContext();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div className={`lyrics-part ${isMounted ? "mounted" : ""}`}>
      { !isManual && dismissedParts.has(idx)
      ? <div className="lyrics-part--header">
          <button type="button" className="restore"
            onClick={() => handleRestorePart(dismissedParts, idx, setDismissedParts)}
          >
            {`${labels.restore} ${part.section}`}
          </button>
        </div>
      : <>
        <div className="lyrics-part--header">
          <button type="button" disabled={isManual} className="red"
            onClick={() => handleSetDismissedParts(dismissedParts, idx, setDismissedParts)}
          >
            {labels.remove}
          </button>

          <span className="lyrics-part--header--section">
            {part.section}
          </span>

          <button type="button" className="green"
            onClick={() => handleSetLyricsParts("", idx, {lyricsParts, setLyricsParts})}
          >
            {labels.clear}
          </button>
        </div>
        <AutoResizeTextarea id={`lyrics-part_${idx}`}
          value={part.lyrics}
          onChange={(e) => handleSetLyricsParts(e.target.value, idx, {lyricsParts, setLyricsParts})}
        />
      </>}
    </div>
  );
};

export default LyricsPart;