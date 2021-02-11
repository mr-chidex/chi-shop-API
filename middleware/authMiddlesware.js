import JWT from "jsonwebtoken";
import { User } from "../model/user.js";

const protect = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Not Authorized, no token" });

    if (!req.headers.authorization.startsWith("Bearer"))
      return res.status(401).json({ message: "Not Authorized, no token" });

    const token = req.headers.authorization.split(" ")[1];

    // console.log(token);

    if (!token)
      return res.status(401).json({ message: "Not Authorized, no token" });

    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    console.log("here", decoded);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

export { protect };
