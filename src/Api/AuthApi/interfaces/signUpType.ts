export interface signUpRequest {
  id: string,
  password: string,
  email: string,
  role: "ADMIN" | "USER",
}

export interface signUpResponse {
  id: string,
}