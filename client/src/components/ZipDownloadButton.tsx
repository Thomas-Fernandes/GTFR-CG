import React from "react";

import { saveAs } from "file-saver";
import JSZip from "jszip";

type Props = {
  id?: string;
  type?: "button" | "submit" | "reset";
  paths: string[];
  output: string;
};

const ZipDownloadButton: React.FC<Props> = ({ id, type, paths, output }) => {
  const handleDownloadButtonClick = async () => {
    const zip = new JSZip();

    await Promise.all(
      paths.map(async (filePath) => {
        try {
          const response = await fetch(filePath);

          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${filePath}`);
          }

          const blob = await response.blob();
          const fileName = (filePath.split('/').pop() ?? "").split('?')[0] ?? "img";

          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Error fetching file at ${filePath}: `, error);
        }
      })
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, output);
  };

  return (
    <button type={type} id={id} onClick={handleDownloadButtonClick}>
      Download All as Zip
    </button>
  );
};

export default ZipDownloadButton;
