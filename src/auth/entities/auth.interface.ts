export interface AuthAccessToken {
  access_token: string;
}

export interface AuthRefreshToken {
  refresh_token: string;
}

export interface AuthPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
