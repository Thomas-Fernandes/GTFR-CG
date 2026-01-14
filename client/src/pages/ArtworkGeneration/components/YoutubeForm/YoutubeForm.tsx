import { useState } from "react";

import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
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
      <ButtonWithSpinner id={SpinnerId.YoutubeUrl} label={labels.submit} isBusy={isProcessingLoading} />
    </form>
  );
};

export default YoutubeForm;
