const express = require("express");
const { addWorkout, getAllUserWorkouts, getAllUserExerciseByName } = require("../Controllers/workout.js");
const auth = require("../Middleware/auth.js");

const workoutRouter = express.Router();

workoutRouter.post("/add", auth, addWorkout);
workoutRouter.get("/getAll", auth, getAllUserWorkouts);
workoutRouter.get("/exerciseByName", auth, getAllUserExerciseByName);
workoutRouter.get("/userExercises", auth, getAllUserExerciseByName);

module.exports = workoutRouter;
