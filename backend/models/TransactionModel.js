const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const TransactionSchema = new Schema({
  balance: {
    type: String,
  },
  description: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Invaild user data ."],
  },
});

module.exports = mongoose.model("Trransaction", TransactionSchema);