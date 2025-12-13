const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    index: [true, "Email Aleardy Signed in"],
    unique: [true, "Email Aleardy Signed in"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  image: String,
 
  address: {
    type: String,
    required: [true, "Address is Requierd"],
  },
  birth_date: { type: Date },
  Balance: {
    type: Number,
    required: [true, "Balance is Requierd"],
  },
});

module.exports = mongoose.model("User", UserSchema);