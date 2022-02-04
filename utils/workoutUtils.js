const exercises = [
  {
    sets: [
      { reps: null, weight: 120 },
      { reps: null, weight: 10 },
      { reps: null, weight: 14 },
    ],
  },
  {
    sets: [
      { reps: 10, weight: 120 },
      { reps: 8, weight: 10 },
      { reps: 3, weight: 14 },
    ],
  },
  {
    sets: [
      { reps: 10, weight: 120 },
      { reps: 84, weight: 30 },
      { reps: 33, weight: 14 },
    ],
  },
];

const calculateVolume = (exercises) => {
  let workoutVolume = 0;
  exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.reps == null || set.weight == null) return; //need to solve this
      const setTotalWeight = +set.reps * +set.weight;
      exercise.totalWeight ? (exercise.totalWeight += setTotalWeight) : (exercise.totalWeight = setTotalWeight);
      exercise.totalReps ? (exercise.totalReps += set.reps) : (exercise.totalReps = set.reps);
      exercise.validSets ? exercise.validSets++ : (exercise.validSets = 1);
    });
    console.log(exercise.totalWeight);

    workoutVolume += exercise.totalWeight || 0;
  });
  return workoutVolume;
};

const createWorkout = (title, exercises) => {
  const volume = calculateVolume(exercises);
  return { title, exercises, volume };
};

// createWorkout(exercises);

module.exports = { createWorkout };
