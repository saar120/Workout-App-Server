const mongoose = require("mongoose");

const Exercises = mongoose.model("Exercises", {}, "exercises");

module.exports = Exercises;
