import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../../styling/showPoses.css";
import WorkoutPoseData from "./workoutPoseData";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ShowWorkouts() {
  const [workoutsData, setWorkoutsData] = useState([]); //pose data from supabase
  useEffect(() => {
    const fetchPoses = async () => {
      let { data: workouts, error } = await supabase
        .from("instructorworkouts")
        .select("*")
        .order("id", { ascending: true })
        .then((data) => {
          setWorkoutsData(data.data);
          console.log("incoming workouts data", data.data);
        });
    };
    fetchPoses().catch(console.error);
  }, []);

  // make the date look pretty
  function parseDate(inputDate) {
    // split the string at 10 characters
    let date = inputDate.slice(0, 10);
    return date;
  }

  return (
    <div className="showAllWorkouts">
      {workoutsData.map((workout, index) => (
        <div className="individualWorkouts" key={"allWorkouts" + workout.id}>
          <h3>Workout {index + 1}</h3>
          <h3>Name: {workout.workout_name}</h3>
          <h3>Created: {parseDate(workout.created_at)}</h3>
          <h3>Difficulty: {workout.difficulty} / 5</h3>
          {workout.poses_array.length > 0 && (
          <WorkoutPoseData inputArray={workout.poses_array} />
          )}
        </div>
      ))}
    </div>
  );
}
