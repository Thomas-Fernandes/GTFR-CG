import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useArtworkGenerationContext } from "@/pages/ArtworkGeneration/contexts";

import { handleSubmitYoutubeUrl } from "./handlers";

const YoutubeForm = () => {
  const { intl } = useAppContext();
  const labels = {
    inputPlaceholder: intl.formatMessage({ id: "pages.artgen.youtube.inputPlaceholder" }),
    submit: intl.formatMessage({ id: "pages.artgen.youtube.submit" }),
  };

  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <form
      id="youtube"
      onSubmit={(e) =>
        handleSubmitYoutubeUrl(e, { url: youtubeUrl }, { isProcessingLoading, setIsProcessingLoading, navigate })
      }
    >
      <label htmlFor="youtube--text" className="hidden">
        {"link input"}
      </label>
      <input
        type="text"
        id="youtube--text"
        placeholder={labels.inputPlaceholder}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      <label htmlFor={SpinnerId.YoutubeUrl} className="hidden">
        {"Search button"}
      </label>
      <div className="submit" id={SpinnerId.YoutubeUrl}>
        <ActionButton type="submit" label={labels.submit} className="spaced" />
      </div>
    </form>
  );
};

export default YoutubeForm;
