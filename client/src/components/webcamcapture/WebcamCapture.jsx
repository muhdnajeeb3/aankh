import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './webcamcapture.css';

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: 'user'
};

const WebcamCapture = ({SetwebcamImage}) => {
	const webcamRef = React.useRef(null);
	const [ image, setImage ] = useState('');
	const capture = React.useCallback(
		() => {
			const imageSrc = webcamRef.current.getScreenshot();
			setImage(imageSrc);
			SetwebcamImage(imageSrc)
			console.log(imageSrc);
		},
		[ webcamRef ]
	);

	return (
		<React.Fragment>
			{image === '' ? (
				<Webcam
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					height={300}
					width={450}
					videoConstraints={videoConstraints}
				/>
			) : (
				<img className="captured" src={image} alt="captured" />
			)}

			{image === '' ? (
				<button onClick={capture}>Capture photo</button>
			) : (
				// <button className="proceed">
				// 	Proceed
				// </button>
				""
			)}
		</React.Fragment>
	);
};

export default WebcamCapture;
