import React, { useState } from "react";
import { Navbar, CtaButton, CommonInput } from "./../../components";
import infinite from "./../../assets/infinite.svg";
import "./landing.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const featureList = [
  "Face Verification",
  "Multiple People Detection",
  "Voice Detection",
  "Devtools Check",
  "Full Screen Check",
  "Multiple Tabs Check",
];

const Landing = () => {
  const [joincode, setJoincode] = useState("");

  const JoinExam = (e) => {
    setJoincode(e.target.value);
  };
  const navigate = useNavigate();
  const handleJoinClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://schneide-exam-protector.onrender.com/api/all-created-test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tests = await response.data._allTests;

      // Find the test with the matching join code
      const test =await tests.find((test) => test.test_code === joincode);
      const matchedjoincode =await test?.test_link_by_user;
      // const duration =await test?.duration;
      localStorage.setItem('examlink',matchedjoincode);
      // localStorage.setItem('duration',duration);
      navigate('/exam')
      console.log(matchedjoincode);
    } catch (error) {
      alert("Invalid join code. Please try again.");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="section-type landing-page">
        <div className="landing-content">
          <div className="headings">
            <span className="sub-text">Advanced & Automated</span>
            <span className="main-heading gradient-text">
              Proctoring Solution
            </span>
          </div>

          <p className="desc">
            A straightforward framework built for online proctoring to create
            online tests within minutes, <i>effortlessly</i>.
          </p>
        </div>

        <div className="landing-cta">
          <Link to="/create">
            <CtaButton text="Create a test" />
          </Link>

          <p className="desc">OR</p>
          <div className="input-item unique-link">
            <input
              type="text"
              placeholder="Unique test code"
              value={joincode}
              onChange={JoinExam}
            />
            <span className="join-link">
              <button className="ctabutton" onClick={handleJoinClick}>Join</button>
            </span>
          </div>
        </div>

        <div className="features-content">
          <div className="curr-heading">
            <p className="gradient-text">
              <b>Powerful</b> & Lightweight
            </p>
            <h2 className="title-heading">Features</h2>
          </div>

          <div className="all-features">
            {featureList.map((it) => (
              <p className="single-feature">{it}</p>
            ))}
          </div>

          <div className="mid-cta">
            <p className="phew">phew...</p>
            <a href="/create">
              <CtaButton />
            </a>
          </div>
        </div>

        <div className="final-features">
          <div className="top-sec">
            <div className="left-text">
              <h3 className="gradient-text">Effortlessly integrates with</h3>
              <h1 className="title-heading">
                Google Forms or Microsoft Surveys
              </h1>
            </div>
            <div className="infinite">
              <img src={infinite} alt="infinite" />
            </div>

            <div className="right-text">
              <h3 className="gradient-text">The best part?</h3>
              <h1 className="title-heading">Live Status on Admin Dashboard</h1>
            </div>
          </div>

          <div className="mid-cta final-cta">
            <p className="phew">
              And it’s <b>free</b>.
              <br />
              What are you waiting for?
            </p>
            <a href="/create">
              <CtaButton text="Create a test" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
