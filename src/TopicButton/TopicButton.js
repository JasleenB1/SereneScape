import React from "react";
import { useNavigate } from "react-router-dom";
import "./TopicButton.css";

export default function TopicButton({ topic, label, image, iconBg }) {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("serenescape_topic", topic);
    navigate(`/help/${topic}`);
  };

  return (
    <button type="button" className="TopicButton" onClick={handleClick}>
      <div className="TopicButton__icon" style={{ backgroundColor: iconBg || "rgba(2,0,112,0.08)" }}>
        <img src={image} alt={label} />
      </div>
      <span className="TopicButton__text">{label}</span>
    </button>
  );
}
