import { HttpStatus } from "@/constants/requests";

export const isFileExtensionAccepted = (fileName: string, acceptedExtensions: string[]): boolean => {
  return acceptedExtensions.includes(fileName.split(".").slice(-1)[0].toLowerCase());
};

export const doesFileExist = async (fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(fileName);
    const contentType = response.headers.get("Content-Type");

    if (response.status === HttpStatus.NotFound || contentType?.includes("text/html")) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};