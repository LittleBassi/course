export interface RegressUserResponse {
  data: RegressUserData;
  support: Support;
}

export interface RegressUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Support {
  url: string;
  text: string;
}
