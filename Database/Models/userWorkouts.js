const mongoose = require("mongoose");

const SetSchema = mongoose.Schema({
  reps: { type: "Number" },
  weight: { type: "Number" },
});

const ExerciseSchema = mongoose.Schema({
  name: { type: "String", required: true },
  sets: [SetSchema],
  totalWeight: { type: "Number", required: true },
  totalReps: { type: "Number", required: true },
  validSets: { type: "Number", required: true },
});

const WorkoutSchema = mongoose.Schema({
  title: { type: "String", required: true },
  exercises: [ExerciseSchema],
  volume: { type: "Number", required: true },
});

const UserWorkoutsSchema = mongoose.Schema({
  creatorID: { type: "String", required: true },
  workouts: [WorkoutSchema],
});

module.exports = mongoose.model("UserWorkouts", UserWorkoutsSchema);
