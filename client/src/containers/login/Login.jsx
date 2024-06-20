import React, { useState } from 'react';
import logo from './../../assets/logofont.svg';
import {  CtaButton } from '../../components';
import {Link, useNavigate} from 'react-router-dom'
import './login.css';

const Login = () => {
	// State to manage form data
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();
  
	// Function to handle form submission
	const handleSubmit = async (e) => {
	  e.preventDefault();
  
	  try {
		const formData = {
			email: email,
			password: password
		  };
		  
		  const response = await fetch('https://schneide-exam-protector.onrender.com/api/signin', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		  });
  
		if (response.ok) {
		  alert('login successful');
		  const data = await response.json();
      		localStorage.setItem('token', data.token);
      		localStorage.setItem('user_id', data.user?._id);
      		localStorage.setItem('user_email', data.user?.email);
      		localStorage.setItem('user_name', data.user?.fullName);
		  navigate('/')
		} else {
		  alert('email or password is incorrect');
		}
	  } catch (error) {
		console.error('Error:', error);
	  }
	};
  
  
	return (
		<div className="user-login">
		<div className="logo">
		<img src='https://www.schneideit.com/wp-content/uploads/2020/12/schneide-logo.svg' alt="schneide-logo" />

		</div>
		<div className="login-form">
			<h1 className="title-heading">User Login</h1>
		  <form onSubmit={handleSubmit}>
			<div className="input-fields">
			  <input
				type="email"
				placeholder="Email ID"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				name="email"
			  />
			  <input
			  name="password"
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			  />
			</div>
			<CtaButton text="Login" type="submit" />
			<div style={{display:'flex',gap:'10px'}}>
				
			<div style={{display:'flex',gap:'10px',alignItems:'center'}}><p>If you dont have account please register</p>

			<Link to='register' className="ctabutton">Register</Link>
			</div>
			</div>
		  </form>
		</div>
	  </div>
	);
  };

// const Login = () => {
// 	return (
// 		<div className="user-login">
// 			<div className="logo">
// 				<img src={logo} alt="aankh-logo" />
// 			</div>
// 			<div className="login-form">
// 				<h1 className="title-heading">User Login</h1>
// 				<div className="input-fields">
// 					{inputField.map((item) => (
// 						<CommonInput placeholderText={item} />
// 					))}
// 				</div>
// 				<a href="/">
// 					<CtaButton text="Login" />
// 				</a>
// 			</div>
// 		</div>
// 	);
// };

export default Login;
