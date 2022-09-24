import * as jose from "jose";

export const checkToken = async (token) => {
  const secret = new TextEncoder().encode("NoumanAminFatta");
  const { payload } = await jose.jwtVerify(token, secret);
  if (payload.id) return payload;
  return false;
};
