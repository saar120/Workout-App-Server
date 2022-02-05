const express = require("express");
const { addWorkout, getAllUserWorkouts } = require("../Controllers/workout.js");
const auth = require("../Middleware/auth.js");

const workoutRouter = express.Router();

workoutRouter.post("/add", auth, addWorkout);
workoutRouter.post("/getAll", auth, getAllUserWorkouts);

module.exports = workoutRouter;
