import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
  role: string;
  permissions: string[];
}

export const generateAccessToken = (
  payload: AuthTokenPayload
): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (
  token: string
): AuthTokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  return jwt.verify(token, secret) as AuthTokenPayload;
};