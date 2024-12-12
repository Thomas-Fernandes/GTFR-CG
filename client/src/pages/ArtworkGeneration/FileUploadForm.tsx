import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import Checkbox from "@/components/Checkbox/Checkbox";
import FileUploader from "@/components/FileUploader/FileUploader";
import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSubmitFileUpload } from "./handlers";

import "./FileUploadForm.scss";

const FileUploadForm = (): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [localFile, setLocalFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  return (
    <form id="local" encType="multipart/form-data"
      onSubmit={(e) => handleSubmitFileUpload(e, { localFile, includeCenterArtwork }, { isProcessingLoading, setIsProcessingLoading, navigate })}
    >
      <div className="local--selectors">
        <FileUploader id="background-image" label="Select background image" accept="image/*" setter={setLocalFile} />
        <Checkbox
          id="include_center_artwork" label="Include center artwork"
          defaultChecked={includeCenterArtwork}
          onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
        />
      </div>
      <div className="submit" id={SpinnerId.FileUpload}>
        <ActionButton type="submit" label="UPLOAD" className="spaced" />
      </div>
    </form>
  );
};

export default FileUploadForm;