import React, { ComponentPropsWithoutRef } from "react";

import JSZip from "jszip";

import { saveAs } from "file-saver";

type Props = ComponentPropsWithoutRef<"button"> & {
  id?: string;
  paths: string[];
  output: string;
};

const ZipDownloadButton: React.FC<Props> = ({ id, paths, output, ...props }) => {
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
    <button
      type="button" id={id} onClick={handleDownloadButtonClick}
      {...props}
    >
      {"Download All as Zip"}
    </button>
  );
};

export default ZipDownloadButton;
