import { JSX, useState } from "react";

import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSubmitYoutubeUrl } from "./handlers";

const YoutubeForm = (): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <form
      id="youtube"
      onSubmit={(e) => handleSubmitYoutubeUrl(e, { url: youtubeUrl }, { isProcessingLoading, setIsProcessingLoading, navigate })}
    >
      <div className="flexbox">
        <input type="text" placeholder={"Paste YouTube video URL here"}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <div className="action-button pad-l-1" id={SpinnerId.YoutubeUrl}>
          <input type="submit" value="SEARCH" className="action-button" />
        </div>
      </div>
    </form>
  );
};

export default YoutubeForm;