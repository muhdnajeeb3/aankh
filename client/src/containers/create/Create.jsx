import React, { useState } from "react";
import logo from "./../../assets/logofont.svg";
import { CtaButton } from "../../components";
import { useNavigate } from "react-router-dom";
import "./create.css";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Create = () => {
  // State to manage form data
  const [show, setShow] = useState(false);
  const [testCode, setTestCode] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    organizationName: "",
    testName: "",
    questionPaperLink: "",
    totalExpectedCandidates: "",
    startDateTimeFormat: "",
    duration: "",
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/create-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify(formData)
        body: JSON.stringify({
          email: formData.email,
          test_name: formData.testName,
          test_link_by_user: formData.questionPaperLink,
          start_time: formData.startDateTimeFormat,
          end_time: formData.endDateTimeFormat,
          no_of_candidates_appear: parseInt(formData.totalExpectedCandidates),
          total_threshold_warnings: 11,
          // total_threshold_warnings: parseInt(formData.totalThresholdWarnings)
        }),
      });
      const result = await response.json();
      setTestCode(result?.test_code);
      console.log(result);

      if (response.ok) {
        // alert(`Test creation successful. Test Code: ${result?.test_code}`);
        handleShow();
      } else {
        alert(result.msg || "Test creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(testCode)
      .then(() => {
        alert("Test code copied to clipboard.");
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="client-create">
      <div className="logo">
        <img
          src="https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg"
          alt="schneide-logo"
        />
      </div>
      <div className="create-form">
        <h1 className="title-heading">Create a test</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-fields">
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="organizationName"
              placeholder="Organization Name"
              value={formData.organizationName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="testName"
              placeholder="Test Name"
              value={formData.testName}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="questionPaperLink"
              placeholder="Question Paper Link"
              value={formData.questionPaperLink}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="totalExpectedCandidates"
              placeholder="Total Expected Candidates"
              value={formData.totalExpectedCandidates}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="startDateTimeFormat"
              placeholder="Start Date-Time Format"
              value={formData.startDateTimeFormat}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration In Minutes"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Test Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>{testCode}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCopyClick}>
                Copy
              </Button>
            </Modal.Footer>
          </Modal>
          <CtaButton text="Create" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Create;
