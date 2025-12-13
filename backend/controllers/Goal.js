const asyncWrapper = require("../middleware/asyncWrapper");
const GoalModel = require("../models/GoalModel");

class GoalController {
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const goals = await GoalModel.find({
      user_id: userId,
    });
    res.json({
      data: goals,
    });
  });

  static getGoal = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const goal = await GoalModel.findById(id);
    res.json({
      data: goal,
    });
  });

  static create = asyncWrapper(async (req, res, next) => {
    const { user_id, name, targetAmount, savedAmount, deadline } = req.body;
    const goal = await GoalModel.create({
      user_id,
      name,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
    });
    res.json({
      msg: "SUCCESS",
      data: goal,
    });
  });

  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { name, targetAmount, savedAmount, deadline } = req.body;
    const goal = await GoalModel.findByIdAndUpdate(
      id,
      { name, targetAmount, savedAmount, deadline },
      { new: true }
    );
    res.json({
      msg: "SUCCESS",
      data: goal,
    });
  });

  static delete = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const goal = await GoalModel.findByIdAndDelete(id);
    res.status(202).json({
      data: goal,
    });
  });
}

module.exports = GoalController;