import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY;

export const createJWT = (data) => {
  console.log(secretKey)
  return jwt.sign(data, secretKey, { expiresIn: "1h" });
};

export const verifyJWT = (token) => {
  let decodedData;
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      throw new Error("JWT Token verification failed!");
    }
    decodedData = decoded;
  });

  return decodedData;
};
