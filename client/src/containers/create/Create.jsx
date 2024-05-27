import React, { useState } from 'react';
import logo from './../../assets/logofont.svg';
import { CtaButton } from '../../components';
import { useNavigate } from 'react-router-dom';
import './create.css';


const Create = () => {
  // State to manage form data

  const [formData, setFormData] = useState({
    email: '',
    organizationName: '',
    testName: '',
    questionPaperLink: '',
    totalExpectedCandidates: '',
    startDateTimeFormat: '',
    duration: ''
  });
  

  const navigate = useNavigate();

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
	const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // body: JSON.stringify(formData)
		body: JSON.stringify({
			email: formData.email,
			test_name: formData.testName,
			test_link_by_user: formData.questionPaperLink,
			start_time: formData.startDateTimeFormat,
			end_time: formData.endDateTimeFormat,
			no_of_candidates_appear: parseInt(formData.totalExpectedCandidates),
			total_threshold_warnings: 11
			// total_threshold_warnings: parseInt(formData.totalThresholdWarnings)
		  })
		
      });

      if (response.ok) {
        console.log('Test creation successful');
        navigate('/success');
      } else {
        console.error('Test creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="client-create">
      <div className="logo">
        <img src='https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg' alt="schneide-logo" />
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
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <CtaButton text="Create" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Create;
