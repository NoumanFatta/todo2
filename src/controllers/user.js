import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";
const secret = new TextEncoder().encode("NoumanAminFatta");

export const loginUser = async (user) => {
  const { email, password } = user;
  let success = false;
  const userData = JSON.parse(localStorage.getItem("users"));
  const userFound = userData.find((user) => user.email === email);
  if (!userFound) {
    return { msg: "Please enter correct details", success };
  }
  if (userFound.password !== password) {
    return { msg: "Please enter correct details", success };
  }

  const token = await new jose.SignJWT({
    id: userFound.id,
    email: userFound.email,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
  success = true;
  return { token, success };
};

export const signupUser = async (user) => {
  let success = false;
  const { email, password, firstName, lastName } = user;
  if (email && password && firstName && lastName) {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = allUsers.find((user) => user.email === email);
    if (userFound) {
      return { msg: "Email already exists", success };
    }
    const id = uuidv4();
    allUsers.push({ email, password, firstName, lastName, id });
    localStorage.setItem("users", JSON.stringify(allUsers));
    const token = await new jose.SignJWT({
      id,
      email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    success = true;
    return { token, success };
  } else {
    return { msg: "Missing Fields", success };
  }
};
