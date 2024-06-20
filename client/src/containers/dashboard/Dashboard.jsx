import React, { useEffect, useState } from "react";
import logo from "./../../assets/logofont.svg";
import { CopyLink } from "../../components";
import "./dashboard.css";
import axios from "axios";

const mockTests = [
  {
    name: "Periodic Test - DBMS",
    link: "asd-qwvs-dfs",
    time: "20/01/2022 17:30",
  },
  {
    name: "Periodic Test - OSLT",
    link: "pbl-dfse-phd",
    time: "21/01/2022 17:30",
  },
  {
    name: "Periodic Test - SPCC",
    link: "fhh-dfgg-aee",
    time: "22/01/2022 17:30",
  },
];

const Dashboard = () => {
  const [mockTestdata, setMockTestdata] = useState([]);
  const mockTests1 = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://schneide-exam-protector.onrender.com/api/all-created-test",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const tests = await response.data._allTests;
      setMockTestdata(tests);

      console.log(tests);
    } catch (error) {
      alert("Invalid join code. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    mockTests1();
  }, []);
  return (
    <div className="section-type admin-dashboard">
      <div className="logo">
        <img
          src="https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg"
          alt="schneide-logo"
        />
      </div>

      <h1 className="title-heading">Admin Dashbaord</h1>

      <div className="test-dashboard">
        <h2 className="title-heading">Tests</h2>

        <div className="test-items">
          {mockTestdata.map((test) => (
            <div className="test-item">
              <h4 className="test-time">{test.start_time}</h4>

              <h4 className="test-name">
                <a href="/status">{test.test_name}</a>
              </h4>

              <CopyLink link={test.test_code} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
