import { LyricsPart } from "../../common/Types";
import { AutoResizeTextarea } from "../../components/AutoResizeTextarea";
import { StateHook } from "../ArtworkGeneration/handlers";

import "./Lyrics.css";

type LyricsPartViewProps = {
  key?: number;
  part: LyricsPart;
  idx: number;
  dismissedPartsState: StateHook<Set<number>>;
  handleSetLyricsParts: (lyrics: string, idx: number) => void;
};

const LyricsPartView: React.FC<LyricsPartViewProps> = ({key, part, idx, dismissedPartsState, handleSetLyricsParts}): JSX.Element => {
  const [dismissedParts, setDismissedParts] = dismissedPartsState;
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
        <button type="button" className="green" onClick={() => handleSetLyricsParts("", idx)}>
          {"Clear"}
        </button>
        </div>
        <AutoResizeTextarea title={`lyrics-part_${idx}`}
          value={part.lyrics} onChange={(e) => handleSetLyricsParts(e.target.value, idx)}
        />
      </>}
      <hr className="w-66 mv-0" />
    </div>
  );
};

type LyricsPartsProps = {
  lyricsParts: LyricsPart[];
  dismissedPartsState: StateHook<Set<number>>;
  handleSetLyricsParts: (lyrics: string, idx: number) => void;
};

const LyricsParts: React.FC<LyricsPartsProps> = ({lyricsParts, dismissedPartsState, handleSetLyricsParts}): JSX.Element => {
  return (
    <>
      { lyricsParts.map((part, idx) =>
        <LyricsPartView key={idx} part={part} idx={idx} dismissedPartsState={dismissedPartsState} handleSetLyricsParts={handleSetLyricsParts} />
      )}
    </>
  );
};

export default LyricsParts;