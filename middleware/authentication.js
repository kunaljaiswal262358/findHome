import { data } from "../project-config.js";
import { verifyJWT } from "../utils/jwtUtility.js";

export const authenticate = (req, res, next) => {
  const auth = data.authentication;
  if (auth === false) return next();

  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res
        .status(400)
        .json({ errorMessage: "Authentication token is missing." });

    verifyJWT(authHeader);
  } catch (error) {
    return res.status(400).json({ Error: "Token is invalid" });
  }

  next();
};
