import React, { useState, useEffect } from "react";
import { Timer, WebLiveCapture } from "./../../components";
import devtools from "devtools-detect";
import "./exam.css";
import axios from "axios";

const Exam = ({
  examName = "Periodic Test - DBMS: 20th January, 2022",
  studentID = localStorage.getItem("user_id"),
  studentEmail = localStorage.getItem("user_email"),
  duration = 60,
  formLink = localStorage.getItem("examlink"),
}) => {
  const [warningCnt, setWarningCnt] = useState(0);
  const [peopledetected, setPeopledetected] = useState(0);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showMessage, setShowMessage] = useState("");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [terminatedUsers, setTerminatedUsers] = useState([]);

  // TO EMBED
  formLink += "?embedded=true";
  const increasePersonDetected = async () => {
    try {
      await axios.patch(
        "https://schneide-exam-protector.onrender.com/api/warning-person-detected",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to increase person detected warning count:", error);
    }
  };

  const fetchAllowedUsers = async () => {
    try {
      const response = await axios.get("/api/allowed-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAllowedUsers(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch allowed users:",
        error.response?.data || error.message
      );
    }
  };
  const fetchTerminatedUsers = async () => {
    try {
      const response = await axios.get("/api/terminated-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTerminatedUsers(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch terminated users:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchAllowedUsers();
    fetchTerminatedUsers();
  }, []); 

  useEffect(() => {
    const devtoolsDetector = setInterval(() => {
      if (
        window.outerWidth - window.innerWidth > 100 ||
        window.outerHeight - window.innerHeight > 100
      ) {
        setWarningCnt((prev) => prev + 1);
        setIsDevToolsOpen(true);
        setShowMessage("Your exam will terminate. Please close devtools.");
        disableForm();
        // alert("Developer tools are not allowed during the exam.");
        // Hide the message after 5 seconds
        // setTimeout(() => setShowMessage(""), 5000);
        setTimeout(() => enableForm(), 10000);
      } else {
        setIsDevToolsOpen(false);
        // enableForm();
      }
      terminateExam();
    }, 500);

    return () => clearInterval(devtoolsDetector);
  }, [warningCnt, isDevToolsOpen]);

  useEffect(() => {
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [isFullScreen, warningCnt]);

  useEffect(() => {
    const interval = setInterval(captureCheck, 10000);
    return () => clearInterval(interval);
  }, []);

  function captureCheck() {
    let btn = document.querySelector(
      "#root > div > div > div.left-column > div.image-capture > button"
    );
    btn.click();
  }
  useEffect(() => {
    let intervalId; // To store the interval ID

    if (peopledetected > 1) {
      setWarningCnt((prev) => prev + 1);
      setShowMessage("More Than One People detected");
      disableForm();
      // alert("more than one people detected");
      increasePersonDetected();
      // Display the message every 5 seconds
      intervalId = setInterval(() => {
        setShowMessage("Multiple People detected");

        // Increment the count if peopledetected stays equal to 2
        if (peopledetected === 2) {
          setWarningCnt((prev) => prev + 1);
          increasePersonDetected();
        }
      }, 5000);
    } else {
      enableForm();
      // Clear the interval when peopledetected is not greater than 1
      clearInterval(intervalId);
    }

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [peopledetected]);

  function check() {
    // if (!window.screenTop && !window.screenY && isFullScreen) {
    //   setIsFullScreen(false);
    // }
    // if (!isFullScreen) {
    //   setWarningCnt(warningCnt + 1);
    //   setShowMessage("Your exam will terminate. Please go to full screen mode.");
    //   disableForm();
    // } else {
    //   enableForm();
    // }
    // terminateExam();
  }

  function disableForm() {
    let overlay = document.getElementById("overlay");
    let formBlur = document.getElementById("form-blur");
    overlay.classList.remove("hide");
    overlay.classList.add("disable");
    formBlur.classList.add("blur");
  }

  function enableForm() {
    let overlay = document.getElementById("overlay");
    let formBlur = document.getElementById("form-blur");
    overlay.classList.add("hide");
    overlay.classList.remove("disable");
    formBlur.classList.remove("blur");
  }

  function terminateExam() {
    if (warningCnt > 5) {
      disableForm();
      let overlay = document.getElementById("overlay");
      overlay.classList.add("terminate");
    }
  }

  return (
    <div className="exam-container">
      <div className="left-column">
        <div className="image-capture">
          <WebLiveCapture setPeopledetected={setPeopledetected} />
        </div>
        <div className="exam-details">
          <h3 className="title-heading">Student Details</h3>
          <div className="details">
            <h4 className="student-id">Student ID: {studentID}</h4>
            <h4 className="student-email">Student Email: {studentEmail}</h4>
          </div>
        </div>
      </div>
      <div className="embedded-form">
        <div className="hide" id="overlay">
          <h2>Message: {showMessage}</h2>
          <h2>Warnings: {warningCnt}</h2>
          <h1>Exam Terminated</h1>
          <h3>Please contact your organization/admin.</h3>
        </div>
        <div className="form" id="form-blur">
          <h2 className="title-heading">{examName}</h2>
          <iframe title={examName} className="form-link" src={formLink}>
            Form
          </iframe>
          <div className="responsive-message">
            <h1>Please join via a Laptop/PC for best performance</h1>
          </div>
        </div>
      </div>
      <div className="timer">
        <Timer initialMinute={duration} />
      </div>
    </div>
  );
};

export default Exam;
