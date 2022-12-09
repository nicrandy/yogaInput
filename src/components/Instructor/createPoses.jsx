import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import ShowPoses from "./showPoses";
var randomstring = require("randomstring");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatePoses() {
  const [toggles, setToggles] = useState({
    view: false,
    add: true,
  }); // toggle between view and add
  const [poseDataToUpload, setPoseDataToUpload] = useState({});
  const [image, setImage] = useState([]); // array to store local images
  const [imageURL, setImageURL] = useState([]); // array to store local image urls
  const [allDataFilled, setAllDataFiled] = useState(false); // check if all data is filed
  const inputFile = useRef(null);

  // update state on input change
  const handleInputChange = (e) => {
    console.log(e.target.name);
    setPoseDataToUpload({
      ...poseDataToUpload,
      [e.target.name]: e.target.value,
    });
    console.log("poseDataToUpload", poseDataToUpload);
  };

  // upload pose data to supabase
  const handleSubmit = (e) => {
    e.preventDefault();
    checkInput();
    // console.log("poseDataToUpload", poseDataToUpload);
    // const data = supabase
    //   .from("poses")
    //   .insert([poseDataToUpload])
    //   .select() // get the inserted data
    //   .then((data) => {
    //     const poseNumber = data.data[0].id;
    //     console.log("pose id returned: ", poseNumber); // pose id returned
    //     uploadImage(poseNumber);
    //   });
  };

  // upload image(s) to supabase
  async function uploadImage(poseID) {
    let imageURLArray = []; // track image urls so can update pose record with them
    for (let i = 0; i < image.length; i++) {
      // generate a random string for the image name
      const stringGenerator = randomstring.generate(7); // create random string of (x) length for image name
      const supabaseFolder = "poses/"; // folder in supabase bucket to store images
      const imageNameString = supabaseFolder + stringGenerator + image[i].name;
      imageURLArray.push(imageNameString);
      const data = await supabase.storage
        .from("poseimages")
        .upload(imageNameString, image[i], {
          cacheControl: "3600",
          upsert: false,
          contentType: "image",
        })
        .then((data) => {
          uploadImageData(poseID, imageNameString);
          // update pose defalult image
          if (i == poseDataToUpload.default_image) {
            updatePoseData(
              poseID,
              imageURLArray[poseDataToUpload.default_image]
            );
          }
        });
    }
  }
  // create the image data in supabase
  async function uploadImageData(poseID, imageNameString) {
    const data = await supabase.from("imagedata").insert([
      {
        pose: poseID,
        url: imageNameString,
      },
    ]);
  }

  // update the pose information with default image url
  async function updatePoseData(poseID, imageURL) {
    const data = await supabase
      .from("poses")
      .update({ default_image: imageURL })
      .eq("id", poseID)
      .then((data) => {
        console.log("pose data updated", data);
      });
  }
  // click event for loading local images
  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      let imageArray = [];
      let imageURLArray = [];
      for (let i = 0; i < files.length; i++) {
        // append images array
        imageArray.push(files[i]);
        let localURL = URL.createObjectURL(files[i]);
        imageURLArray.push(localURL);
      }
      setImage(imageArray);
      setImageURL(imageURLArray);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

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
  // check if all data is filled before uploading
  function checkInput() {
    if (poseDataToUpload.name && 
      poseDataToUpload.description &&
      poseDataToUpload.difficulty &&
      poseDataToUpload.left_right &&
      poseDataToUpload.default_image &&
      imageURL.length > 0) {
      return setAllDataFiled(true);
    } else {
      return setAllDataFiled(false);
    }
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
            Add Pose
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
              Select images <p> </p>
              <label>
                <input
                  ref={inputFile}
                  onChange={handleFileUpload}
                  type="file"
                  name="default_image"
                  multiple
                />
                <div className="button" onClick={onButtonClick}></div>
              </label>
              Select primary image:
              <div className="imagesGroup">
                {imageURL.map((url, index) => (
                  <div className="imageAndRadioButton">
                    {/* create radio buttons for 1 - 5 */}
                    <input
                      type="radio"
                      name="default_image"
                      value={index}
                      onChange={handleInputChange}
                    />
                    <img
                      key={index}
                      className="previewUploadImg"
                      src={url}
                      alt="uploaded"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              Pose name
              <label>
                <input type="text" name="name" onChange={handleInputChange} />
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
                  name="made_by"
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
            <div className="form-group">
              Left and Right?
              <label>
                <input
                  type="radio"
                  value={true}
                  name="left_right"
                  onChange={handleInputChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  defaultChecked
                  value={false}
                  name="left_right"
                  onChange={handleInputChange}
                />
                No
              </label>
            </div>
            <div className="form-group">
              <button type="submit">Submit</button>
              {/* {allDataFilled && <p>Success!</p>} */}
              {!allDataFilled && <p>Please fill out all fields</p>}
            </div>
          </form>
        </div>
      )}
      {/* view and edit poses */}
      {toggles.view && <ShowPoses showExtraImages={true} />}
    </div>
  );
}
