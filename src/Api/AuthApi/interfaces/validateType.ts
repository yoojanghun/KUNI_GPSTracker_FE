export interface validateRequest {
  Authorization: string,
}

export interface validateResponse {
  loginId: string,
  valid: boolean
}