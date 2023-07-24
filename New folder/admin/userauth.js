import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Missing token." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "yourSecretPrivateKey");
    console.log(decodedToken);

    const user = await User.findOne({
      where: {
        emailid: decodedToken.emailid,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. You are not a user." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized. Token expired." });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized. Invalid token not matched." });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
