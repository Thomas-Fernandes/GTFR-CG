import { useState } from "react";

import ButtonRemove from "@/components/ButtonRemove/ButtonRemove";
import { useAppContext } from "@/contexts";

import { FileUploaderProps } from "./types";

import "./FileUploader.scss";

const FileUploader = ({ id, label, caption, accept, setter }: FileUploaderProps) => {
  const { intl } = useAppContext();
  const labels = {
    defaultCaption: intl.formatMessage({ id: "components.fileUploader.defaultCaption" }),
  };

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target?.files?.length && e.target.files.length > 0) {
      const file = e.target.files[0];
      const displayName =
        file.name.length > 20 ? `${file.name.slice(0, 17)}...` + file.name.split(".").pop() : file.name;
      setSelectedFileName(displayName);
      setter(file);
    } else if (e === null) {
      setSelectedFileName(null);
      setter(undefined);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true); // Highlight the component
  };
  const handleDragLeave = () => {
    setIsDragging(false); // Remove highlight when leaving the component
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Remove highlight

    if (e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`file-upload ${isDragging ? "dragging" : ""}`}>
      <div
        onClick={() => document.getElementById(id)?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id={id} name="file-upload" accept={accept} onChange={handleFileChange} className="hidden" />
        <label htmlFor="file-upload" className="file-upload--label">
          {label}
        </label>
        <span className={`file-upload--caption ${selectedFileName ? "" : "italic"}`}>
          {selectedFileName ?? caption ?? labels.defaultCaption}
        </span>
      </div>
      {selectedFileName && <ButtonRemove onClick={() => handleFileChange(null)} />}
    </div>
  );
};

export default FileUploader;
