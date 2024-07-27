import { HttpMethod } from './Types';

export const is2xxSuccessful = (status: number): boolean => {
  return status >= 200 && status < 300;
};

export const sendRequest = async (method: HttpMethod, url: string, body?: object) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

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