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

const getAllUserExerciseByName = async () => {
  try {
    const creatorID = "61fef4dd477502f4fbad8354";
    const exName = "3/4 Sit-Up";
    const test = await getExercisesByNameAndID(exName, creatorID);

    console.log(test);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addWorkout, getAllUserWorkouts };
