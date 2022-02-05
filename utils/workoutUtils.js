const calcRM1 = (reps, weight) => {
  return weight * (1 + reps / 30);
};

const calculateExercises = (exercises) => {
  let workoutVolume = 0;
  exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.reps == null || set.weight == null) return; //need to solve this
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

const createWorkout = (title, exercises) => {
  const volume = calculateExercises(exercises);
  return { title, exercises, volume };
};

module.exports = { createWorkout };
