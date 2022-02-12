const express = require("express");
const {
  addWorkout,
  getAllUserWorkouts,
  getAllUserExerciseByName,
  getAllUserExercisesTypes,
  deleteWorkout,
  suggestedMuscles,
} = require("../Controllers/workout.js");
const auth = require("../Middleware/auth.js");

const workoutRouter = express.Router();

workoutRouter.post("/add", auth, addWorkout);
workoutRouter.get("/getAll", auth, getAllUserWorkouts);
workoutRouter.post("/exerciseByName", auth, getAllUserExerciseByName);
workoutRouter.get("/userExercisesTypes", auth, getAllUserExercisesTypes);
workoutRouter.post("/delete", auth, deleteWorkout);
workoutRouter.get("/suggestMuscle", auth, suggestedMuscles);

module.exports = workoutRouter;
