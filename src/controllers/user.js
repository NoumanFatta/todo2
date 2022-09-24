import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";
const secret = new TextEncoder().encode("NoumanAminFatta");
function UserException(title, message) {
  this.message = message;
  this.title = title;
}
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const loginUser = async (user) => {
  const { email, password } = user;
  let success = false;
  const userData = JSON.parse(localStorage.getItem("users"));
  if (email && password) {
    if (emailRegex.test(email)) {
      const userFound = userData.find((user) => user.email === email);
      if (!userFound) {
        throw new UserException(
          "Wrong credentials",
          "Email or password is incorrect"
        );
      }
      if (userFound.password !== password) {
        throw new UserException(
          "Wrong credential",
          "Email or password is incorrect"
        );
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
    } else {
      throw new UserException("Wrong Email", "Email is incorrect");
    }
  }else{
    throw new UserException(
      "Missing fields",
      "All fields are required"
    );
  }
};

export const signupUser = async (user) => {
  let success = false;
  const { email, password, firstName, lastName } = user;
  if (email && password && firstName && lastName) {
    if (emailRegex.test(email)) {
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const userFound = allUsers.find((user) => user.email === email);
      if (userFound) {
        throw new UserException("Already Exists", "Email already exists");
      }
      const id = uuidv4();
      allUsers.push({ email, password, firstName, lastName, id });
      localStorage.setItem("users", JSON.stringify(allUsers));
      const token = await new jose.SignJWT({
        id,
        email,
        firstName,
        lastName,
      })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);
      success = true;
      return { token, success };
    } else {
      throw new UserException("Not correct", "Email not correct");
    }
  } else {
    throw new UserException("Missing fields", "All fields are required");
  }
};
