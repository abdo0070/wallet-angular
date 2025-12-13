const { verify } = require("jsonwebtoken");
const verifyJWT = async (req, res, next) => {
  let token =
    req.headers["Authorization"] || req.headers["authorization"] || "";
  try {
    if (!token) {
      console.log("[Auth] No token provided in headers");
      throw new Error("No token provided");
    }
    const bearer = token.split(" ");
    if (bearer.length !== 2) {
      console.log("[Auth] Malformed token header:", token);
      throw new Error("Malformed token");
    }
    token = bearer[1];
    // console.log("[Auth] Verifying token:", token.substring(0, 10) + "...");
    const secret = process.env.JWT_KEY || "mysecretkey123";
    req.payload = await verify(token, secret);
    console.log("[Auth] Token verified for user:", req.payload.userId || req.payload._id);
    next();
  } catch (error) {
    console.error("[Auth] Verification failed:", error.message);
    return res.status(403).json({
      message: error.message,
      status: 403,
    });
  }
};

module.exports = verifyJWT;