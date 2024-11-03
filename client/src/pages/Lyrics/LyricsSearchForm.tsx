
import { SPINNER_ID } from "@constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSearchSubmit } from "./handlers";

const LyricsSearchForm = (): JSX.Element => {
  const { isFetching, setIsFetching, artist, setArtist, songName, setSongName, setLyricsParts, setPageMetadata } = useLyricsContext();

  return (
    <form className="search-form flexbox"
      onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata})}
    >
      <div id="search-bar" className="flex-row g-1">
        <input required
          type="text" name="artist" placeholder="Enter artist name"
          onChange={(e) => setArtist(e.target.value)}
        />
        <input required
          type="text" name="songName" placeholder="Enter song name"
          onChange={(e) => setSongName(e.target.value)}
        />
        <div className="action-button pad-l-1" id={SPINNER_ID.LYRICS_SEARCH}>
          <input type="submit" value="SEARCH" className="action-button search-button" />
        </div>
      </div>
    </form>
  )
};

export default LyricsSearchForm;