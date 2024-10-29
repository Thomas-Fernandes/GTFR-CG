import { HTTP_STATUS } from "../../constants/Common";

export const isFileExtensionAccepted = (fileName: string, acceptedExtensions: string[]): boolean => {
  return acceptedExtensions.includes(fileName.split(".").slice(-1)[0].toLowerCase());
};

export const doesFileExist = async (fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(fileName);
    const contentType = response.headers.get("Content-Type");

    if (response.status === HTTP_STATUS.NOT_FOUND || contentType?.includes("text/html")) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};