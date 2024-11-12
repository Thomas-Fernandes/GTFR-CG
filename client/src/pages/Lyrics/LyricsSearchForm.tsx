
import { SpinnerId } from "@/constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSearchSubmit } from "./handlers";

const LyricsSearchForm = (): JSX.Element => {
  const { artist, songName, isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts, setArtist, setSongName } = useLyricsContext();

  return (
    <form className="search-form flexbox"
      onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts})}
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
        <div className="action-button pad-l-1" id={SpinnerId.LyricsSearch}>
          <input type="submit" value="SEARCH" className="action-button search-button" />
        </div>
      </div>
    </form>
  )
};

export default LyricsSearchForm;