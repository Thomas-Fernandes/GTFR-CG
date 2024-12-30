import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSubmitYoutubeUrl } from "./handlers";

const YoutubeForm = () => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <form
      id="youtube"
      onSubmit={(e) => handleSubmitYoutubeUrl(e, { url: youtubeUrl }, { isProcessingLoading, setIsProcessingLoading, navigate })}
    >
      <label htmlFor="youtube--text" className="hidden">{"link input"}</label>
      <input type="text" id="youtube--text"
        placeholder={"Paste YouTube video URL here"}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      <label htmlFor={SpinnerId.YoutubeUrl} className="hidden">{"Search button"}</label>
      <div className="submit" id={SpinnerId.YoutubeUrl}>
        <ActionButton type="submit" label={"SEARCH"} className="spaced" />
      </div>
    </form>
  );
};

export default YoutubeForm;