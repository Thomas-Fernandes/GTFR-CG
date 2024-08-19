import { HTTP_STATUS } from "../../constants/Common";

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