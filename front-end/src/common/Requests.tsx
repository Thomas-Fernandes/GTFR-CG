import { HTTP_STATUS } from "../constants/Common";
import { HttpMethod } from "./Types";

export const is2xxSuccessful = (status: number): boolean => {
  return status >= HTTP_STATUS.OK && status < HTTP_STATUS.MULTIPLE_CHOICES;
};

export const sendRequest = async (method: HttpMethod, url: string, body?: object) => {
  let response;
  try {
    response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      status: 503,
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