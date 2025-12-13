const { sign } = require("jsonwebtoken");
const genrateToken = (payload) => {
  const secret = process.env.JWT_KEY || "mysecretkey123";
  console.log("DEBUG: Using secret:", secret ? "YES (Loaded)" : "NO (Missing)");

  const token = sign({ data: payload }, secret, {
    expiresIn: "20h",
  });
  return token;
};

module.exports = genrateToken;