import { HttpStatus } from "@/constants/requests";
import { Toast } from "@/constants/toasts";

import { RestVerb } from "./types";

export const isErrorful = (status: number): boolean => {
  return status >= HttpStatus.BadRequest
    && status <= HttpStatus.NetworkAuthenticationRequired;
};
export const is2xxSuccessful = (status: number): boolean => {
  return status >= HttpStatus.Ok
    && status < HttpStatus.MultipleChoices;
};

export const sendRequest = async (method: RestVerb, url: string, body?: unknown) => {
  const requestHeaders = body instanceof FormData
    ? {}
    : { "Content-Type": "application/json" };
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
        status: HttpStatus.ServerUnavailable,
        message: Toast.ServerUnavailable,
      };
    }
    return {
      status: HttpStatus.InternalServerError,
      message: (err as Error).message,
    };
  }

  if (!response.ok) {
    console.error(`Error: ${response.status} ${response.statusText}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const objectToQueryString = (obj: Record<string, unknown>): string => { // TODO remove this when backend unit tests are implemented
  const finalObj: Record<string, string> = {};
  for (const key in obj)
    if (obj[key] !== undefined && obj[key] !== null)
      finalObj[key] = obj[key].toString();
  return "?" + (new URLSearchParams(finalObj).toString());
};