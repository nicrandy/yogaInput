import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import ShowWorkouts from "./showWorkouts";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreateWorkout() {
  const [toggles, setToggles] = useState({
    view: false,
    add: true,
  });
  const [poseDataToUpload, setPoseDataToUpload] = useState({});
  const [poseData, setPoseData] = useState([]); //pose data from supabase
  const [chosenPoses, setChosenPoses] = useState([]); //pose data from supabase
  const [savedPoseIDs, setSavedPoseIDs] = useState([]); //id of pose to be saved to supabase

  // get pose data from supabase
  useEffect(() => {
    const fetchPoses = async () => {
      let { data: poses, error } = await supabase
        .from("poses")
        .select("*")
        .order("id", { ascending: true })
        .then((data) => {
          console.log("data", data.data);
          setPoseData(data.data);
        });
    };
    fetchPoses().catch(console.error);
  }, []);

  const handleInputChange = (e) => {
    console.log(e.target.name);
    setPoseDataToUpload({
      ...poseDataToUpload,
      [e.target.name]: e.target.value,
    });
  };

  // uploade workout data to supabase
  const handleSubmit = (e) => {
    e.preventDefault();
    // get the pose ID number from the pose objects
    const poseIDs = chosenPoses.map((pose) => pose.id);
    console.log("poseDataToUpload", poseDataToUpload);
    const dataToUpload = { ...poseDataToUpload, poses_array: poseIDs };
    console.log("DataToUpload", dataToUpload);
    const data = supabase
      .from("instructorworkouts")
      .insert([dataToUpload])
      .select() // get the inserted data
      .then((data) => {
        const postedData = data.data[0];
        console.log("pose id returned: ", postedData); // pose id returned
      });
  };

  function setPoseAsChosen(poseID) {
    console.log("poseID", poseID);
    for (let i = 0; i < poseData.length; i++) {
      if (poseData[i].id === poseID) {
        setChosenPoses([...chosenPoses, poseData[i]]);
      }
    }
  }

  function removePose(poseID) {
    console.log("poseID", poseID);
    for (let i = 0; i < chosenPoses.length; i++) {
      if (chosenPoses[i].id === poseID) {
        chosenPoses.splice(i, 1);
        setChosenPoses([...chosenPoses]);
      }
    }
  }

  function displayToggle(toggle) {
    if (toggle === "view") {
      setToggles({
        view: true,
        add: false,
      });
    } else if (toggle === "add") {
      setToggles({
        add: true,
        view: false,
      });
    }
  }

  function updatePoseOrder(id,index,direction){
    console.log("id",id, "index", index, "direction", direction)
    console.log("chosen poses before update", chosenPoses)
    if(direction === "L"){
      if(index === 0){
        return
      }
      let temp = chosenPoses[index-1]
      chosenPoses[index-1] = chosenPoses[index]
      chosenPoses[index] = temp
      setChosenPoses([...chosenPoses])
    }
    if(direction === "R"){
      if(index === chosenPoses.length-1){
        return
      }
      let temp = chosenPoses[index+1]
      chosenPoses[index+1] = chosenPoses[index]
      chosenPoses[index] = temp
      setChosenPoses([...chosenPoses])
    }
    console.log("chosen poses after update", chosenPoses)
  }

  return (
    <div className="App">
      {/* buttons to select options */}
      <div className="displayToggleButtons">
        <div className="toggleButton">
          <button
            className="indivToggleButtons"
            onClick={() => displayToggle("add")}
          >
            Add Workout
          </button>
        </div>
        <div className="toggleButton">
          <button
            className="indivToggleButtons"
            onClick={() => displayToggle("view")}
          >
            View / Edit
          </button>
        </div>
      </div>
      {/* create form that takes in user input */}
      {toggles.add && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              Workout Name:
              <label>
                <input
                  type="text"
                  name="workout_name"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-group">
              Difficulty
              <label>
                1{/* create radio buttons for 1 - 5 */}
                <input
                  type="radio"
                  name="difficulty"
                  value="1"
                  onChange={handleInputChange}
                />
                <input
                  type="radio"
                  name="difficulty"
                  value="2"
                  onChange={handleInputChange}
                  defaultChecked
                />
                <input
                  type="radio"
                  name="difficulty"
                  value="3"
                  onChange={handleInputChange}
                />
                <input
                  type="radio"
                  name="difficulty"
                  value="4"
                  onChange={handleInputChange}
                />
                <input
                  type="radio"
                  name="difficulty"
                  value="5"
                  onChange={handleInputChange}
                />
                5
              </label>
            </div>
            <div className="form-group">
              Made by
              <label>
                <input
                  type="text"
                  name="instructor"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-group">
              Description
              <label>
                <input
                  type="text"
                  name="description"
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="selectWorkoutPoses">
              {chosenPoses.map((pose, index) => (
                <div
                  className="indivWorkoutPoseSelection"
                  key={"chosenPose" + pose}
                >
                  <div className="movePoseButtons">
                    <button type="button" className="indivMovePoseButtons" onClick={() => updatePoseOrder(pose.id,index,"L")}>
                      L
                    </button>
                    <h3>{index + 1}</h3>
                    <button type="button" className="indivMovePoseButtons" onClick={() => updatePoseOrder(pose.id,index,"R")}>
                      R
                    </button>
                  </div>
                  <h3>{pose.name}</h3>
                  <img
                    className="selectWorkoutPosesImg"
                    src={
                      "https://tqhxkupgyjwaqnsyhrgc.supabase.co/storage/v1/object/public/poseimages/" +
                      pose.default_image
                    }
                    alt={pose.name}
                  />
                  <button type="button" onClick={() => removePose(pose.id)}>
                    Remove Pose
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
      {/* display all poses */}
      {toggles.add && (
      <div className="selectFromAllWorkoutPoses">
        {poseData.map((pose) => (
          <div className="indivWorkoutPoseSelection" key={"allPoses" + pose.id}>
            <h3>{pose.name}</h3>
            <img
              className="selectWorkoutPosesImg"
              src={
                "https://tqhxkupgyjwaqnsyhrgc.supabase.co/storage/v1/object/public/poseimages/" +
                pose.default_image
              }
              alt={pose.name}
            />
            <button onClick={() => setPoseAsChosen(pose.id)}>Add Pose</button>
          </div>
        ))}
      </div>
      )}
      {toggles.view && (
        <ShowWorkouts />
      )}
    </div>
  );
}
