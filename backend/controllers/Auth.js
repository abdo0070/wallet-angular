const genrateToken = require("../jwt/generateTokon");
const asyncWrapper = require("../middleware/asyncWrapper");
const UserModel = require("../models/UserModel");

class AuthController {
  static login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email: email,
      password: password,
    });
    if (user == null || user == undefined) {
      throw Error("WRONG EMAIL OR PASSWORD");
    }
    const token = genrateToken(JSON.stringify(user));
    res.json({
      token: token,
      user,
      role: 1,
    });
  });
  static register = asyncWrapper(async (req, res, next) => {
    const newUser = await UserModel.create(req.body);
    const token = genrateToken(JSON.stringify(newUser));
    res.json({
      token: token,
      data: newUser,
    });
  });
}
module.exports = AuthController;
