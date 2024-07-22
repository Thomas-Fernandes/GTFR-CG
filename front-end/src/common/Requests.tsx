import { HttpMethod } from './Types';

const sendRequest = async (method: HttpMethod, url: string, body: object): Promise<object> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
}

export { sendRequest };