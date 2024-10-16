import React, { useState } from "react";

type Props = {
  id: string;
  label: string;
  caption?: string;
  accept?: string;
  labelClassName?: string;
  captionClassName?: string;
  setter: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const FileUploader: React.FC<Props> = ({ id, label, caption, accept, labelClassName, captionClassName, setter }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target?.files?.length && e.target.files.length > 0) {
      const file = e.target.files[0];
      const displayName = file.name.length > 20 ? `${file.name.slice(0, 17)}...` + file.name.split('.').pop() : file.name;
      setSelectedFileName(displayName);
      setter(file);
    } else if (e === null) {
      setSelectedFileName(null);
      setter(undefined);
    }
  };

  return (
    <div className="file-upload-component flexbox flex-row">
      <div className="flexbox flex-row" onClick={() => document.getElementById(id)?.click()}>
        <input
          type="file" name="file-upload" accept={accept}
          id={id} className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className={labelClassName}>
          {label}
        </label>
        <p className={captionClassName + (selectedFileName ? "" : " italic")}>
          {selectedFileName ?? (caption ?? "No file selected.")}
        </p>
      </div>
      { selectedFileName &&
        <button type="button" className="btn-remove"
          onClick={() => handleFileChange(null)}
        >
          <span className="btn-remove--cross">{"✖"}</span>
        </button>
      }
    </div>
  );
};

export default FileUploader;
