import { HTTP_STATUS, TOAST } from "../constants/Common";
import { HttpMethod } from "./Types";

export const isErrorCode = (status: number): boolean => {
  return status >= HTTP_STATUS.BAD_REQUEST && status < 600;
};
export const is2xxSuccessful = (status: number): boolean => {
  return status >= HTTP_STATUS.OK && status < HTTP_STATUS.MULTIPLE_CHOICES;
};

export const sendRequest = async (method: HttpMethod, url: string, body?: unknown) => {
  const requestHeaders = body instanceof FormData
    ? {}
    : {
      "Content-Type": "application/json",
    };
  const requestBody = body instanceof FormData ? body : JSON.stringify(body);
  let response: Response;

  try {
    response = await fetch(url, {
      method: method,
      headers: requestHeaders as HeadersInit,
      body: requestBody as BodyInit,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Failed to fetch") {
      return {
        status: HTTP_STATUS.SERVER_UNAVAILABLE,
        message: TOAST.SERVER_UNAVAILABLE,
      };
    }
    return {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: (err as Error).message,
    };
  }

  if (!response.ok) {
    console.error(`Error: ${response.status} ${response.statusText}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const objectToQueryString = (obj: Record<string, unknown>): string => {
  const finalObj: Record<string, string> = {};
  for (const key in obj)
    if (obj[key] !== undefined && obj[key] !== null)
      finalObj[key] = obj[key].toString();
  return "?" + (new URLSearchParams(finalObj).toString());
};