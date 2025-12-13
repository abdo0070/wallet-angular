const asyncWrapper = require("../middleware/asyncWrapper");
const UserModel = require("../models/UserModel");

class UserController {
  static getAll = asyncWrapper(async (req, res, next) => {
    const users = await UserModel.find({});
    res.json({
      msg: "SUCCESS",
      data: users,
    });
  });
  static singleUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.json({
      data: user,
      msg: "SUCCESS",
    });
  });
  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(id, req.body);
    res.json({
      msg: "SUCCESS",
      data: user,
    });
  });
  static delete = asyncWrapper(async (req, res, next) => {
    res.send("delete");
  });
}

module.exports = UserController;
