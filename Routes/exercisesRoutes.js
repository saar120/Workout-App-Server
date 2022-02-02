const { Router } = require("express");
import { getAllExercises } from "../Controllers/exercises";

const exercisesRouter = Router();

exercisesRouter.use("/all", getAllExercises);

module.exports = exercisesRouter;
