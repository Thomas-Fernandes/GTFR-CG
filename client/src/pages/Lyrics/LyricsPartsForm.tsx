import { useState } from "react";

import { AutoResizeTextarea } from "@components/AutoResizeTextarea/AutoResizeTextarea";

import { SPINNER_ID } from "@constants/spinners";

import { useLyricsContext } from "./context";
import { handleLyricsSaveSubmit, handleSetLyricsParts } from "./handlers";
import { LyricsPartType } from "./types";
import { convertToCardContents } from "./utils";

import "./LyricsPartsForm.css";

type LyricsPartProps = {
  key?: number;
  part: LyricsPartType;
  idx: number;
};

const LyricsPart: React.FC<LyricsPartProps> = ({key, part, idx}): JSX.Element => {
  const { lyricsParts, setLyricsParts, dismissedParts, setDismissedParts } = useLyricsContext();
  key?.valueOf(); // unused

  return (
    <div key={"part_" + idx} className="lyrics-part">
      { dismissedParts.has(idx)
      ? <div className="lyrics-part--header flexbox flex-row g-2">
        <button type="button" className="restore" onClick={() => { const n = new Set(dismissedParts); n.delete(idx); setDismissedParts(n)}}>
          {`Restore ${part.section}`}
        </button>
      </div> : <>
      <div className="lyrics-part--header flexbox flex-row g-2">
        <button type="button" className="red" onClick={() => setDismissedParts(new Set(dismissedParts).add(idx))}>
          {"Remove"}
        </button>
        <label>{part.section}</label>
        <button type="button" className="green" onClick={() => handleSetLyricsParts("", idx, {lyricsParts, setLyricsParts})}>
          {"Clear"}
        </button>
        </div>
        <AutoResizeTextarea title={`lyrics-part_${idx}`}
          value={part.lyrics} onChange={(e) => handleSetLyricsParts(e.target.value, idx, {lyricsParts, setLyricsParts})}
        />
      </>}

      <hr className="w-66 mv-0" />
    </div>
  );
};

type LyricsPartsFormProps = {
  lyricsParts: LyricsPartType[];
};

const LyricsPartsForm: React.FC<LyricsPartsFormProps> = ({ lyricsParts }): JSX.Element => {
  const { dismissedParts, pageMetadata, isManual, navigate } = useLyricsContext();

  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  return (
    <form className="lyrics-form flexbox"
      onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts),
        {isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate}
      )}
    >
      { lyricsParts.map((part, idx) =>
        <LyricsPart key={idx} part={part} idx={idx} />
      )}
      <div className="action-button" id={SPINNER_ID.LYRICS_CONVERT}>
        <input type="submit" value="CONVERT TO CARDS" className="action-button convert-button" />
      </div>
    </form>
  );
};

export default LyricsPartsForm;