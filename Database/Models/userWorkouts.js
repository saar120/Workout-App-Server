const mongoose = require("mongoose");

const SetSchema = mongoose.Schema({
  reps: { type: "Number" },
  weight: { type: "Number" },
});

const ExerciseSchema = mongoose.Schema({
  name: { type: "String", required: true },
  sets: [SetSchema],
  rm1: { type: "Number" },
  volume: { type: "Number" },
  totalWeight: { type: "Number" },
  totalReps: { type: "Number" },
  validSets: { type: "Number" },
});

const WorkoutSchema = mongoose.Schema({
  title: { type: "String", required: true },
  exercises: [ExerciseSchema],
  volume: { type: "Number" },
});

const UserWorkoutsSchema = mongoose.Schema({
  creatorID: { type: "String", required: true },
  workouts: [WorkoutSchema],
});

module.exports = mongoose.model("UserWorkouts", UserWorkoutsSchema);
