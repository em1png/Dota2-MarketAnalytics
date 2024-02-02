import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js"

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Access denied" });
    }
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};
