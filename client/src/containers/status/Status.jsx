import React, { useEffect, useState } from "react";
import { CopyLink, Terminated, PieChart } from "../../components";
import "./status.css";
import axios from "axios";

const Status = ({
  time = "20/01/2022 17:30",
  name = "Periodic Test - DBMS",
  link = "asd-qwvs-dfs",
}) => {
  const [warnings, setWarnings] = useState([]);
  const [pieData, setPieData] = useState({
    labels: ["Terminated", "Warnings > 4", "Warnings > 1", "Continue"],
    datasets: [
      {
        label: "Events",
        backgroundColor: ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"],
        hoverBackgroundColor: ["#501800", "#4B5000", "#175000", "#003350"],
        data: [0, 0, 0, 0], // Initial empty data
      },
    ],
  });

  const fetchWarnings = async () => {
    try {
      const response = await axios.get("/api/all-warnings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const terminatedresponse = await axios.get("/api/terminated-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const AllowedUsers = await axios.get("/api/allowed-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const warningsData = response.data;
      const terminatedData = terminatedresponse.data;
      const allowedData = AllowedUsers.data;

      // Process data to count the number of students in each category
      let terminatedCount = terminatedData.length,
        warningsGt4 = 0,
        warningsGt1 = 0,
        continueCount = allowedData.length;

      warningsData.forEach((user) => {
        const totalWarnings = user.person_detected;
        if (totalWarnings > 5) {
          return terminatedCount;
        } else if (totalWarnings > 4) {
          warningsGt4++;
        } else if (totalWarnings > 1) {
          warningsGt1++;
        } else {
          return allowedData;
        }
      });

      setWarnings(warningsData);

      setPieData({
        ...pieData,
        datasets: [
          {
            ...pieData.datasets[0],
            data: [terminatedCount, warningsGt4, warningsGt1, continueCount],
          },
        ],
      });
    } catch (error) {
      console.error(
        "Failed to fetch warnings:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  return (
    <div className="status-dashboard">
      <div className="logo">
        <img
          src="https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg"
          alt="schneide-logo"
        />
      </div>

      <h1 className="title-heading">Test Dashboard</h1>

      <div className="test-details">
        <div className="test-item">
          <h4 className="test-time">{time}</h4>
          <h4 className="test-name">{name}</h4>
          <CopyLink link={link} />
        </div>
      </div>
      <div className="charts">
        <PieChart data={pieData} />
      </div>
      <div className="terminated-students">
        {/* <h2 className="title-heading">Students Terminated</h2> */}
        <h2 className="title-heading">Students Warnings</h2>
        <div className="terminated-boxes">
          {warnings.map((item) => (
            <Terminated
              studentID={item._id}
              warningCnt={item.person_detected}
              message="Multiple People Detected"
              key={item.studentID}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
