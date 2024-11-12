import React, { useState } from "react";

import { StateSetter } from "@/common/types";

import ButtonRemove from "@/components/ButtonRemove/ButtonRemove";

import "./FileUploader.css";

type Props = {
  id: string;
  label: string;
  caption?: string;
  accept?: string;
  labelClassName?: string;
  captionClassName?: string;
  setter: StateSetter<File | undefined>;
};

const FileUploader: React.FC<Props> = ({ id, label, caption, accept, labelClassName, captionClassName, setter }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
    <div className={`file-upload-component flexbox flex-row ${isDragging ? "dragging" : ""}`}>
      <div className="flexbox flex-row"
        onClick={() => document.getElementById(id)?.click()}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      >
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
        <ButtonRemove onClick={() => handleFileChange(null)} />
      }
    </div>
  );
};

export default FileUploader;
