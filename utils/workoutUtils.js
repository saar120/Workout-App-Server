const UserWorkout = require("../Database/Models/userWorkouts.js");
const Exercises = require("../Database/Models/exercisesModel.js");

const calcRM1 = (reps, weight) => {
  return weight * (1 + reps / 30);
};

const calculateExercises = (exercises) => {
  let workoutVolume = 0;
  exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.reps === "" || set.weight === "" || set.weight === ".") {
        const error = new Error("All fields needs to be filled");
        error.code = 400;
        throw error;
      }
      set.weight = parseFloat(set.weight);
      set.reps = parseInt(set.reps);
      const setVolume = +set.reps * +set.weight;
      exercise.volume ? (exercise.volume += setVolume) : (exercise.volume = setVolume);
      exercise.totalReps ? (exercise.totalReps += set.reps) : (exercise.totalReps = set.reps);
      exercise.totalWeight ? (exercise.totalWeight += set.weight) : (exercise.totalWeight = set.weight);
      exercise.validSets ? exercise.validSets++ : (exercise.validSets = 1);
    });

    const { validSets, totalReps, totalWeight } = exercise;

    exercise.rm1 = calcRM1(totalReps / validSets, totalWeight / validSets);

    workoutVolume += exercise.volume || 0;
  });
  return workoutVolume;
};

const createWorkout = (title, exercises, date) => {
  const volume = calculateExercises(exercises);
  return { title, exercises, volume, date };
};

const getWorkoutByID = (creatorID) => {
  return UserWorkout.aggregate([
    {
      $match: {
        creatorID: creatorID,
      },
    },
    { $unwind: "$workouts" },
    { $replaceRoot: { newRoot: "$workouts" } },
    { $sort: { date: -1 } },
  ]);
};

const getExercisesByNameAndID = (exName, creatorID) => {
  return UserWorkout.aggregate([
    {
      $match: {
        creatorID: creatorID,
      },
    },
    {
      $unwind: "$workouts",
    },
    {
      $unwind: "$workouts.exercises",
    },
    {
      $match: {
        "workouts.exercises.name": exName,
      },
    },
    {
      $group: {
        _id: "$workouts.exercises._id",
        date: { $first: "$workouts.date" },
        name: { $first: "$workouts.exercises.name" },
        rm1: { $first: { $round: "$workouts.exercises.rm1" } },
        volume: { $first: "$workouts.exercises.volume" },
        totalReps: { $first: "$workouts.exercises.totalReps" },
        sets: { $first: "$workouts.exercises.sets" },
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);
};

const getSuggestedMuscles = async (creatorID) => {
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
  return suggestedMuscles[0].result;
};

module.exports = { createWorkout, getWorkoutByID, getExercisesByNameAndID, getSuggestedMuscles };
