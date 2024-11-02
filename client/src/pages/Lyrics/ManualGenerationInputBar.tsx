import { useLyricsContext } from "./context";

const ManualGenerationInputBar = (): JSX.Element => {
  const { setArtist, setSongName, pageMetadata, setPageMetadata } = useLyricsContext();

  return (
    <div className="flexbox">
      <div id="metadata-bar" className="flex-row g-1">
        <input required
          type="text" name="artist" placeholder="Enter artist name"
          onChange={(e) => { setArtist(e.target.value); setPageMetadata({...pageMetadata, artist: e.target.value}); }}
        />
        <input required
          type="text" name="songName" placeholder="Enter song name"
          onChange={(e) => { setSongName(e.target.value); setPageMetadata({...pageMetadata, title: e.target.value}); }}
        />
      </div>
    </div>
  )
};

export default ManualGenerationInputBar;