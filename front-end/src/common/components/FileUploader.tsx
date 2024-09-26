import React, { useState } from "react";

type Props = {
  id: string;
  label: string;
  accept?: string;
  labelClassName?: string;
  captionClassName?: string;
  setter: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const FileUploader: React.FC<Props> = ({ id, label, accept, labelClassName, captionClassName, setter }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const displayName = file.name.length > 20 ? `${file.name.slice(0, 17)}...` + file.name.split('.').pop() : file.name;
      setSelectedFileName(displayName);
      setter(file);
    } else {
      setSelectedFileName(null);
      setter(undefined);
    }
  };

  return (
    <div className="file-upload-component flexbox flex-row g-1" onClick={() => document.getElementById(id)?.click()}>
      <input
        type="file" name="file-upload" accept={accept}
        id={id} className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className={labelClassName}>
        {label}
      </label>
      <p className={captionClassName} style={selectedFileName ? {} : { fontStyle: "italic" }}>
        {selectedFileName ?? "No file selected."}
      </p>
    </div>
  );
};

export default FileUploader;
