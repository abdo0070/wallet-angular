const asyncWrapper = require("../middleware/asyncWrapper");
const GoalModel = require("../models/GoalModel");

class GoalController {
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    console.log(`[GoalController] getAll called for userId: ${userId}`);
    const goals = await GoalModel.find({
      user_id: userId,
    });
    console.log(`[GoalController] Found ${goals.length} goals`);
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
    console.log(`[GoalController] create called with body:`, req.body);
    try {
      const goal = await GoalModel.create({
        user_id,
        name,
        targetAmount,
        savedAmount: savedAmount || 0,
        deadline,
      });
      console.log(`[GoalController] Goal created:`, goal._id);
      res.json({
        msg: "SUCCESS",
        data: goal,
      });
    } catch (error) {
      console.error("[GoalController] create error:", error);
      res.status(400).json({ msg: error.message });
    }
  });

  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { name, targetAmount, savedAmount, deadline, isCompleted } = req.body;
    const goal = await GoalModel.findByIdAndUpdate(
      id,
      { name, targetAmount, savedAmount, deadline, isCompleted },
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