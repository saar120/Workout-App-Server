const { Router } = require("express");
const { getAllExercises } = require("../Controllers/exercises.js");

const exercisesRouter = Router();

exercisesRouter.use("/all", getAllExercises);

module.exports = exercisesRouter;
