export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}
