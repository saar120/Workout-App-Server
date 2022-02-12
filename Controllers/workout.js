const Exercises = require("../Database/Models/exercisesModel.js");
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
    console.log(error);
    res.status(500).json({ message: "Error", error });
  }
};

const getAllUserWorkouts = async (req, res) => {
  try {
    const { creatorID } = req;
    const workouts = await getWorkoutByID(creatorID);
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

const deleteWorkout = async (req, res) => {
  try {
    const { creatorID } = req;
    const { workoutID } = req.body;
    console.log(workoutID);
    const deletedWorkout = await UserWorkout.findOneAndUpdate(
      { creatorID },
      { $pull: { workouts: { _id: workoutID } } },
      { returnOriginal: false }
    );
    if (!deletedWorkout) {
      const error = new Error("Workout not found");
      error.code = 404;
      throw error;
    }
    res.status(200).json(deletedWorkout.workouts);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

const suggestedMuscles = async (req, res) => {
  try {
    // const { creatorID } = req;
    const creatorID = "101110504418512249226";
    const userExercisesNames = await UserWorkout.aggregate([
      { $match: { creatorID } },
      { $unwind: "$workouts" },
      { $sort: { "workouts.date": -1 } },
      { $limit: 3 },
      {
        $group: {
          _id: null,
          result: {
            $push: "$workouts.exercises.name",
          },
        },
      },
      {
        $project: {
          _id: 0,
          result: {
            $setUnion: {
              $reduce: {
                input: "$result",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
      },
    ]);
    if (userExercisesNames.length === 0) {
      const error = new Error("Exercises not found");
      error.code = 404;
      throw error;
    }
    const userLastExercises = userExercisesNames[0].result;
    const allMuscles = await Exercises.aggregate([
      { $group: { _id: null, result: { $push: "$primaryMuscles" } } },
      {
        $project: {
          _id: 0,
          result: {
            $setUnion: {
              $reduce: { input: "$result", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } },
            },
          },
        },
      },
    ]);
    const suggestedMuscles = await Exercises.aggregate([
      { $match: { name: { $in: userLastExercises } } },
      { $group: { _id: null, result: { $push: "$primaryMuscles" } } },
      {
        $project: {
          _id: 0,
          result: {
            $setDifference: [
              allMuscles[0].result,
              {
                $setUnion: {
                  $reduce: { input: "$result", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } },
                },
              },
            ],
          },
        },
      },
    ]);
    if (suggestedMuscles.length === 0) {
      const error = new Error("Muscles not found");
      error.code = 500;
      throw error;
    }
    console.log(suggestedMuscles[0].result);
  } catch (error) {
    if (error.code) {
      // return res.status(error.code).json({ message: error.message });
    }
    console.log(error);
    // res.status(500).json({ message: "Error" });
  }
};

suggestedMuscles();

module.exports = {
  addWorkout,
  getAllUserWorkouts,
  getAllUserExerciseByName,
  getAllUserExercisesTypes,
  deleteWorkout,
  suggestedMuscles,
};
