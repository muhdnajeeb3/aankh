import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./weblivecapture.css";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebLiveCapture = ({setPeopledetected}) => {
  const webcamRef = React.useRef(null);
  const [image, setImage] = useState("");

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    // Send captured image to server
    axios
      .post("http://localhost:8080/predict_pose", { img: imageSrc })
      .then((response) => {
        console.log(response.data);
        // Handle the response, e.g., increment warnings if pose is not forward
      })
      .catch((error) => {
        console.error("Error sending image to server:", error);
      });

    axios
      .post("http://localhost:8080/predict_people", { img: imageSrc })
      .then((response) => {
        console.log(response.data.people);
        setPeopledetected(response.data.people)
        // Handle the response, e.g., increment warnings if more than 1 person detected
      })
      .catch((error) => {
        console.error("Error sending image to server:", error);
      });
  }, [webcamRef]);

  return (
    <React.Fragment>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        height={150}
        width={300}
        videoConstraints={videoConstraints}
      />
      <button className="hide" onClick={capture}>
        Capture photo
      </button>
    </React.Fragment>
  );
};

export default WebLiveCapture;
