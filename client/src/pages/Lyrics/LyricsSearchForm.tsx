import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSearchSubmit } from "./handlers";

import "./LyricsSearchForm.scss";

const LyricsSearchForm = (): JSX.Element => {
  const { artist, songName, isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts, setArtist, setSongName } = useLyricsContext();

  return (
    <form className="search-form"
      onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts})}
    >
      <input required type="text" name="artist" placeholder={"Enter artist name"}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input required type="text" name="songName" placeholder={"Enter song name"}
        onChange={(e) => setSongName(e.target.value)}
      />
      <div id={SpinnerId.LyricsSearch} className="spinner">
        <ActionButton type="submit" label="SEARCH" className="spaced" />
      </div>
    </form>
  )
};

export default LyricsSearchForm;