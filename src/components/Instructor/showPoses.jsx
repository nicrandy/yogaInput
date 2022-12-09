import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "../../styling/showPoses.css";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ShowPoses({ showExtraImages }) {
  const nameRef = useRef(null);
  const difficultyRef = useRef(null);
  const mirrorRef = useRef(null);
  const descriptionRef = useRef(null);
  const defaultPoseRef = useRef(null);

  const [poseData, setPoseData] = useState([]); //pose data from supabase
  const [imageData, setImageData] = useState([]); //image data from supabase
  const [edittingPose, setEdittingPose] = useState(-10); // track the id of the current pose being edited
  const [defaultPoseImage, setDefaultPoseImage] = useState(""); // track the id of the current pose being edited
  const [allowEditDefaultImage, setAllowEditDefaultImage] = useState(-10); // track the id of the current pose image being edited
  useEffect(() => {
    const fetchPoses = async () => {
      let { data: poses, error } = await supabase
        .from("poses")
        .select("*")
        .order("id", { ascending: true })
        .then((data) => {
          setPoseData(data.data);
          console.log("incoming pose data", data.data);
        });
      if (error) {
        console.log("error", error);
      } else {
        console.log("-----------------------poses", poses);
      }
    };
    fetchPoses().catch(console.error);

    const fetchAllImages = async (poseID) => {
      let { data: images, error } = await supabase
        .from("imagedata")
        .select("*")
        .then((data) => {
          setImageData(data.data);
        });
      if (error) {
        console.log("error", error);
      } else {
        console.log("-----------------------images", images);
      }
    };
    fetchAllImages().catch(console.error);
  }, []);

  console.log("pose data", poseData);

  function updatePoseInfo(poseID) {
    setEdittingPose(-10); // reset the editting pose
    console.log("poseID", poseID);
    console.log("nameRef", nameRef.current.value);
    console.log("difficultyRef", difficultyRef.current.value);
    console.log("descriptionRef", descriptionRef.current.value);
    console.log("mirrorRef", mirrorRef.current.value);
    console.log("defaultposeimage", defaultPoseImage);

    const poseUpadateData = {
      name: nameRef.current.value,
      difficulty: difficultyRef.current.value,
      left_right: mirrorRef.current.value,
      default_image: defaultPoseImage,
      description: descriptionRef.current.value,
    };
    console.log("poseUpadateData", poseUpadateData);

    const { data, error } = supabase
      .from("poses")
      .update(poseUpadateData)
      .eq("id", poseID)
      .then((data) => {
        console.log("Updated data -> data.data : ", data);
        for (let i = 0; i < poseData.length; i++) {
          if (poseData[i].id === poseID) {
            poseData[i] = {...poseData[i], ...poseUpadateData};
            console.log("poseData[i]", poseData[i]);
          }
        }
      });
  }
  const setDefaultPose = (url) => {
    console.log("this image url", url);
    setDefaultPoseImage(url);
  };
  console.log("defaultPoseImage", defaultPoseImage);

    return (
      <div className="displayPoses">
        {poseData.map((pose) => (
          <div className="indivPoses" key={pose.id}>
            {edittingPose !== pose.id ? (
              <button
                className="editPoseButton"
                onClick={() => {setEdittingPose(pose.id); setDefaultPoseImage(pose.default_image);}}
              >
                Edit
              </button>
            ) : (
              <button
                className="editPoseButton"
                onClick={() => updatePoseInfo(pose.id)}
              >
                Update
              </button>
            )}
            <div className="indivInfo">
              <h1>Pose Name:</h1>
              {edittingPose !== pose.id ? (
                <h2>{pose.name}</h2>
              ) : (
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  defaultValue={pose.name}
                />
              )}
            </div>
            <div className="indivInfo">
              <h1>Mirror ?</h1>
              {edittingPose !== pose.id ? (
                <h2>{pose.left_right ? "Yes" : "No"}</h2>
              ) : (
                <input
                  ref={mirrorRef}
                  type="checkbox"
                  name="left_right"
                  defaultValue={pose.left_right}
                />
              )}
              {/* {pose.left_right ? <h2>Yes</h2> : <h2>No</h2>} */}
            </div>
            <div className="indivInfo">
              <h1>Difficulty (1-5):</h1>
              {edittingPose !== pose.id ? (
                <h2>{pose.difficulty}</h2>
              ) : (
                <input
                  ref={difficultyRef}
                  type="number"
                  name="difficulty"
                  min="1"
                  max="5"
                  defaultValue={pose.difficulty}
                />
              )}
            </div>
            <div className="indivInfo">
              <h1>Description:</h1>
              {edittingPose !== pose.id ? (
                <h2>{pose.description}</h2>
              ) : (
                <textarea
                  ref={descriptionRef}
                  type="text"
                  name="description"
                  defaultValue={pose.description}
                  rows="4"
                />
              )}
            </div>
            <div className="indivInfo">
              <h1>Default image:</h1>
              <img
                className="poseImg"
                src={
                  "https://tqhxkupgyjwaqnsyhrgc.supabase.co/storage/v1/object/public/poseimages/" +
                  pose.default_image
                }
                alt="pose"
              />
              {edittingPose !== pose.id ? (
                <h2>_</h2>
              ) : (
                <button onClick={() => setAllowEditDefaultImage(pose.id)}>
                  Change
                </button>
              )}
              
            </div>
            {/* only show other images if showextraimages is true */}
            {showExtraImages && allowEditDefaultImage === pose.id ? (
              <div className="otherPoseImages">
                {imageData.map((image) => (
                  <div>
                    {image.pose === pose.id &&
                    pose.default_image !== image.url ? (
                      <div>
                        <img
                          className="allPoseImgs"
                          src={
                            "https://tqhxkupgyjwaqnsyhrgc.supabase.co/storage/v1/object/public/poseimages/" +
                            image.url
                          }
                          alt="pose"
                        />
                        {edittingPose !== pose.id ? (
                          <div></div>
                        ) : (
                          <button ref={defaultPoseRef} value={image.url} onClick={() => setDefaultPose(image.url)} className="updateDefault">Default</button>
                        )}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
    );
  }

