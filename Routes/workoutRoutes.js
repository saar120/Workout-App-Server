const express = require("express");
const {
  addWorkout,
  getAllUserWorkouts,
  getAllUserExerciseByName,
  getAllUserExercisesTypes,
} = require("../Controllers/workout.js");
const auth = require("../Middleware/auth.js");

const workoutRouter = express.Router();

workoutRouter.post("/add", auth, addWorkout);
workoutRouter.get("/getAll", auth, getAllUserWorkouts);
workoutRouter.post("/exerciseByName", auth, getAllUserExerciseByName);
workoutRouter.get("/userExercisesTypes", auth, getAllUserExercisesTypes);

module.exports = workoutRouter;
