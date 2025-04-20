import { useState } from "react";

import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import Checkbox from "@/components/Checkbox/Checkbox";
import FileUploader from "@/components/FileUploader/FileUploader";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useArtworkGenerationContext } from "@/pages/ArtworkGeneration/contexts";

import { handleSubmitFileUpload } from "./handlers";

import "./FileUploadForm.scss";

const FileUploadForm = () => {
  const { intl } = useAppContext();
  const labels = {
    fileUploadButton: intl.formatMessage({ id: "pages.artgen.local.fileUploadButton" }),
    includeCenterArtwork: intl.formatMessage({ id: "pages.artgen.local.selectors.includeCenter" }),
    submit: intl.formatMessage({ id: "pages.artgen.local.submit" }),
  };

  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [localFile, setLocalFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  return (
    <form
      id="local"
      encType="multipart/form-data"
      onSubmit={(e) =>
        handleSubmitFileUpload(
          e,
          { localFile, includeCenterArtwork },
          { isProcessingLoading, setIsProcessingLoading, navigate }
        )
      }
    >
      <label htmlFor="local--selectors" className="hidden">
        {"Selectors"}
      </label>
      <div id="local--selectors" className="local--selectors">
        <FileUploader id="background-image" label={labels.fileUploadButton} accept="image/*" setter={setLocalFile} />
        <Checkbox
          id="include_center_artwork"
          size={24}
          checked={includeCenterArtwork}
          onChange={() => setIncludeCenterArtwork(!includeCenterArtwork)}
          label={labels.includeCenterArtwork}
        />
      </div>

      <label htmlFor={SpinnerId.FileUpload} className="hidden">
        {"Upload button"}
      </label>
      <ButtonWithSpinner id={SpinnerId.FileUpload} label={labels.submit} isBusy={isProcessingLoading} />
    </form>
  );
};

export default FileUploadForm;
