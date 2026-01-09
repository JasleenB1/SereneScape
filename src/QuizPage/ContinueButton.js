// ContinueButton.js
import React from 'react';
import './ContinueButton.css'; // Import the CSS file for the button component
import continueImage from './quizPageimages/continueImage.png'; // Import the ContinueButton image

function ContinueButton() {
  const handleClick = () => {
    console.log('Continue buttonclicked');
  };

  return (
    <a href="/quiz2" className="ContinueButton" onClick={handleClick}>
      <img src={continueImage} alt="ContinueButton" /> {/* Render the image */}
      <span className="ButtonText">Continue</span> {/* Render the text */}
    </a>
  );
}

export default ContinueButton;