import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../../styling/showPoses.css";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function WorkoutPoseData(props) {
  const [allPoseDataForWorkout, setAllPoseDataForWorkouts] = useState([]); //pose data from supabase
  useEffect(() => {
    const fetchPoses = async () => {
      let allPoseDataArray = []; // append data to array
      props.inputArray.forEach((pose) => {
        const { data: poses, error } = supabase
          .from("poses")
          .select("*")
          .eq("id", pose)
          .then((data) => {
            allPoseDataArray.push(data.data);
          });
      });
      setAllPoseDataForWorkouts(allPoseDataArray);
    };
    fetchPoses().catch(console.error);
  }, []);

  console.log("---------allPoseDataForWorkouts", allPoseDataForWorkout);

  return (
    <div className="individualWorkoutAllImages">
      {allPoseDataForWorkout.map((workout, index) => (
        <div className="individualWorkoutImageData" key={"allWorkouts" + workout.id + index}>
          <h3>{workout[0].name}</h3>
          <img
            className="indivWorkoutImage"
            src={
              "https://tqhxkupgyjwaqnsyhrgc.supabase.co/storage/v1/object/public/poseimages/" +
              workout[0].default_image
            }
            alt={workout.name}
          />
        </div>
      ))}
    </div>
  );
}
