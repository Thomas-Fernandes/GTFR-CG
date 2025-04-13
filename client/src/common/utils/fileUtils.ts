import { saveAs } from "file-saver";
import JSZip from "jszip";

import { sendToast } from "@/common/Toast";
import { HttpStatus, ResponseStatus } from "@/constants/requests";
import { ToastType } from "@/constants/toasts";

export const downloadFilesAsZip = async (filepaths: string[], outputFilepath: string) => {
  const zip = new JSZip();

  await Promise.all(
    filepaths.map(async (filepath) => {
      try {
        const response = await fetch(filepath);

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${filepath}`);
        }

        const blob = await response.blob();
        const fileName = (filepath.split("/").pop() ?? "").split("?")[0] ?? "img";

        zip.file(fileName, blob);
      } catch (err) {
        sendToast((err as Error).message, ResponseStatus.Error);
        console.error(`Error fetching file at ${filepath}: `, (err as Error).message);
      }
    })
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });

  saveAs(zipBlob, outputFilepath);
};

export const downloadFile = (filepath: string) => {
  const filename = filepath.split("/").pop();

  const link = document.createElement("a");
  link.download = filename ? filename.split("?")[0] : "card.png";
  link.href = filepath;
  document.body.appendChild(link);

  try {
    console.log("Downloading", filepath);
    link.click();
  } catch (err) {
    sendToast((err as Error).message, ToastType.Error);
  } finally {
    document.body.removeChild(link);
  }
};

export const isFileExtensionAccepted = (fileName: string, acceptedExtensions: string[]): boolean => {
  return acceptedExtensions.includes(fileName.split(".").slice(-1)[0].toLowerCase());
};

export const doesFileExist = async (fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(fileName);
    const contentType = response.headers.get("Content-Type");

    return !(response.status === HttpStatus.NotFound || contentType?.includes("text/html"));
  } catch (err) {
    console.error(err);
    return false;
  }
};
