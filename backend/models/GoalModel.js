const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const GoalSchema = new Schema({
  name: {
    type: String,
    required: [true, "Goal name is required"],
  },
  targetAmount: {
    type: Number,
    required: [true, "Target amount is required"],
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
    required: [true, "Deadline is required"],
  },
  createdAt: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Invalid user data."],
  },
});

module.exports = mongoose.model("Goal", GoalSchema);