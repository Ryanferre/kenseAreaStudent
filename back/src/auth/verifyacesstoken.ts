import jwt, { JwtPayload } from "jsonwebtoken";

const SERVICE_SECRET = process.env.SERVICE_SECRET!;

export interface ServiceTokenPayload extends JwtPayload {
  iss: string;
  aud: string;
  sub: string;
  scope?: string[];
}

export function verifyAccess(token: string): ServiceTokenPayload {

  try {
    const payload = jwt.verify(token, SERVICE_SECRET, {
      issuer: "backend-1",
      audience: "backend-2",
    }) as ServiceTokenPayload;

    console.log("🔑 TOKEN PAYLOAD:", payload)
    return payload;
  } catch(error) {

    console.log("erro de verificação: ", error)
    throw new Error("Unauthorized");
  }
}