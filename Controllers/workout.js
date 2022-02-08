const UserWorkout = require("../Database/Models/userWorkouts.js");
const { createWorkout, getWorkoutByID, getExercisesByNameAndID } = require("../utils/workoutUtils.js");

const addWorkout = async (req, res) => {
  try {
    const { creatorID } = req;
    const { title, exercises, date } = req.body;
    const workout = createWorkout(title, exercises, date);
    const existingUserWorkouts = await UserWorkout.findOneAndUpdate(
      { creatorID: creatorID },
      { $push: { workouts: workout } },
      { returnOriginal: false }
    );
    if (!existingUserWorkouts) {
      const newUserWorkouts = await UserWorkout.create({ creatorID, workouts: [workout] });
      res.status(200).json(newUserWorkouts);
    } else {
      res.status(200).json(existingUserWorkouts);
    }
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(500).json({ message: "Error" });
  }
};

const getAllUserWorkouts = async (req, res) => {
  try {
    const { creatorID } = req;
    const workouts = await getWorkoutByID(creatorID);
    if (workouts.length === 0) {
      const error = new Error("Workouts not found");
      error.code = 404;
      throw error;
    }
    res.status(200).json({ workouts });
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

const getAllUserExerciseByName = async (req, res) => {
  try {
    const { creatorID } = req;
    const { exName } = req.body;
    const exercises = await getExercisesByNameAndID(exName, creatorID);
    console.log(exercises.length);
    if (exercises.length === 0) {
      const error = new Error("Exercises not found");
      error.code = 404;
      throw error;
    }
    res.status(200).json(exercises);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

const getAllUserExercisesTypes = async (req, res) => {
  try {
    const { creatorID } = req;
    const exercises = await UserWorkout.findOne({ creatorID }).distinct("workouts.exercises.name");
    if (exercises.length === 0) {
      const error = new Error("Exercises not found");
      error.code = 404;
      throw error;
    }
    res.status(200).json(exercises);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

module.exports = { addWorkout, getAllUserWorkouts, getAllUserExerciseByName, getAllUserExercisesTypes };
