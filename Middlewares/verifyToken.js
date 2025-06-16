import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.session?.admin?.accessToken || null;
    console.log("token", token);
    console.log("session", req.session);

    if (!token) {
      // Option 1: Redirect with query parameter
      return res.redirect("/?error=Access Denied! Please log in.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      // Option 1: Redirect with query parameter
      return res.redirect("/?error=Invalid or expired token, Please login again.");
    }
  } catch (err) {
    console.log("err", err);
    return res.redirect("/?error=Internal server error");
  }
};

export default verifyToken;