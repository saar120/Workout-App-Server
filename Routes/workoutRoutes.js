const express = require("express");
const { addWorkout } = require("../Controllers/workout.js");

const workoutRouter = express.Router();

workoutRouter.post("/add", addWorkout);

module.exports = workoutRouter;
