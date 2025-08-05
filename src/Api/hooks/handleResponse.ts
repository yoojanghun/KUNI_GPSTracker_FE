import type { AfterResponseHook } from "ky";


interface ErrorResponse {
  timeStamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export const handleResponse: AfterResponseHook = async (request, options, response) => { 
  if (!response.ok) {
    const errorData = (await response.json().catch(() => null) as ErrorResponse | null);

    if (errorData) {
      const message = errorData?.message || 'Unknown error';

      console.log(`requset: ${request.body}, options: ${options.body}, response: ${response.body}, message: ${message}`);
      throw new Error(message);      
    }
  }

  return response;
 }