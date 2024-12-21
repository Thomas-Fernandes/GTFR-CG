import { useEffect, useState } from "react";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea/AutoResizeTextarea";

import { useLyricsContext } from "./contexts";
import { handleRestorePart, handleSetDismissedParts, handleSetLyricsParts } from "./handlers";
import { LyricsPartProps } from "./types";

import "./LyricsPart.scss";

const LyricsPart: React.FC<LyricsPartProps> = ({ part, idx }) => {
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
          <button type="button" className="restore" onClick={() => handleRestorePart(dismissedParts, idx, setDismissedParts)}>
            {`Restore ${part.section}`}
          </button>
        </div>
      : <>
        <div className="lyrics-part--header">
          <button type="button" disabled={isManual} className="red"
            onClick={() => handleSetDismissedParts(dismissedParts, idx, setDismissedParts)}
          >
            {"Remove"}
          </button>

          <span className="lyrics-part--header--section">
            {part.section}
          </span>

          <button type="button" className="green"
            onClick={() => handleSetLyricsParts("", idx, {lyricsParts, setLyricsParts})}
          >
            {"Clear"}
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