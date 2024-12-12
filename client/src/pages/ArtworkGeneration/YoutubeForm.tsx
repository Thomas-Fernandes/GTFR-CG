import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSubmitYoutubeUrl } from "./handlers";

import "./YoutubeForm.scss";

const YoutubeForm = (): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <form
      id="youtube"
      onSubmit={(e) => handleSubmitYoutubeUrl(e, { url: youtubeUrl }, { isProcessingLoading, setIsProcessingLoading, navigate })}
    >
      <input type="text" placeholder={"Paste YouTube video URL here"}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <div className="submit" id={SpinnerId.YoutubeUrl}>
        <ActionButton type="submit" label={"SEARCH"} className="spaced" />
      </div>
    </form>
  );
};

export default YoutubeForm;