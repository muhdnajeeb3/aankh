import React, { useState } from 'react';
import logo from './../../assets/logofont.svg';
import human from './../../assets/human.svg';
import { CtaButton, WebcamCapture } from '../../components';
import './register.css';


const Register = () => {
  // State to manage form data
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [webcamImage, SetwebcamImage] = useState()

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('fullName', fullName);
      formData.append('password', password);
      formData.append('profilePicture', webcamImage);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Registration successful');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="user-register">
      <div className="logo">
      <img src='https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg' alt="schneide-logo" />

      </div>
      <div className="register-form">
        <h1 className="title-heading">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-fields">
            {/* {inputFields.map((item, index) => (
              <CommonInput 
                key={index} 
                placeholderText={item} 
                value={formData[item.toLowerCase().replace(/\s/g, '')]} 
                onChange={(e) => handleInputChange(e, item.toLowerCase().replace(/\s/g, ''))} 
              />
            ))} */}
			 <input
			   type="text"
			   placeholder="Full Name"
			   value={fullName}
			   onChange={(e) => setFullName(e.target.value)}
			   required
			 />
			<input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="image-capture">
            <img src={human} alt="human-outline" />
            <WebcamCapture SetwebcamImage={SetwebcamImage}/>
          </div>
          <CtaButton text="Register" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Register;
