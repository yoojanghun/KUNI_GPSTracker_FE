import type { AfterResponseHook } from "ky";


interface ErrorResponse {
  status: number;
  errorMessage: string;
}

export const handleResponse: AfterResponseHook = async (request, options, response) => { 
  if (!response.ok) {
    const errorData = (await response.json().catch(() => null) as ErrorResponse | null);

    if (errorData) {
      const message = errorData.errorMessage || 'Unknown error';

      console.log(`requset: ${request}, options: ${options}, response: ${response}, message: ${message}`);
      throw new Error(message);      
    }
  }

  return response;
 }