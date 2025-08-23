export interface logInRequest {
  id: string,
  password: string,
}

export interface logInResponse {
  token: string
}