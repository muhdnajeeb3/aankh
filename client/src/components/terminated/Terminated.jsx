import React from 'react';
import './terminated.css';
import axios from 'axios';

const Terminated = ({ studentID, warningCnt, message }) => {
  const Terminate = async () => {
    try {
      const response = await axios.patch(`/api/terminate/${studentID}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        alert('User Terminated');
      }
    } catch (error) {
      console.error("Failed to Terminate", error.response?.data || error.message);
    }
  };

  const AllowInExam = async () => {
    try {
      const response = await axios.patch(`/api/allow-in-exam/${studentID}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        alert('User Allowed to Continue');
      }
    } catch (error) {
      console.error("Failed to Allow in Exam", error.response?.data || error.message);
    }
  };

  const TerminateCandidate = () => {
    Terminate();
  };

  const AllowCandidate = () => {
    AllowInExam();
  };

  return (
    <div className="terminated">
      <div className="terminated-details">
        <h4 className="student-id">ID: {studentID}</h4>
        <h4 className="warning-cnt">Warnings: {warningCnt}</h4>
        <h4 className="message">Message: {message}</h4>
      </div>
      <div className="btns">
        <button className="terminate-btn" onClick={TerminateCandidate}>Terminate</button>
        <button className="continue-btn" onClick={AllowCandidate}>Continue</button>
      </div>
    </div>
  );
};

export default Terminated;
