import { AutoResizeTextarea } from "@/components/AutoResizeTextarea/AutoResizeTextarea";

import { useLyricsContext } from "./contexts";
import { handleRestorePart, handleSetDismissedParts, handleSetLyricsParts } from "./handlers";
import { LyricsPartProps } from "./types";

import "./LyricsPart.css";

const LyricsPart: React.FC<LyricsPartProps> = ({ part, idx }): JSX.Element => {
  const { isManual, dismissedParts, setDismissedParts, lyricsParts, setLyricsParts } = useLyricsContext();

  return (
    <div key={"part_" + idx} className="lyrics-part">
      { !isManual && dismissedParts.has(idx)
      ? <div className="lyrics-part--header flexbox flex-row gap-8">
          <button type="button" className="restore" onClick={() => handleRestorePart(dismissedParts, idx, setDismissedParts)}>
            {`Restore ${part.section}`}
          </button>
        </div>
      : <>
        <div className="lyrics-part--header flexbox flex-row gap-8">
          <button type="button" disabled={isManual}
            onClick={() => handleSetDismissedParts(dismissedParts, idx, setDismissedParts)}
            className="red"
          >
            {"Remove"}
          </button>
          <label>{part.section}</label>
          <button type="button"
            onClick={() => handleSetLyricsParts("", idx, {lyricsParts, setLyricsParts})}
            className="green"
          >
            {"Clear"}
          </button>
        </div>
        <AutoResizeTextarea title={`lyrics-part_${idx}`}
          value={part.lyrics} onChange={(e) => handleSetLyricsParts(e.target.value, idx, {lyricsParts, setLyricsParts})}
        />
      </>}

      <hr className="w-66 my-0" />
    </div>
  );
};

export default LyricsPart;