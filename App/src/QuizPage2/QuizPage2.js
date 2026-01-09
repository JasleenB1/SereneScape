import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizPage2.css";

const TOPIC_TITLES = {
  anxiety: "Anxiety",
  depression: "Depression",
  "time-management": "Time Management",
  communication: "Communication",
  studying: "Studying",
  other: "Other",
};

function QuizPage2() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [topicAnswers, setTopicAnswers] = useState({});
  const [input, setInput] = useState("");
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const storedTopic = localStorage.getItem("serenescape_topic") || "";
    const storedAnswers = localStorage.getItem("serenescape_topic_answers");

    setTopic(storedTopic);

    try {
      setTopicAnswers(storedAnswers ? JSON.parse(storedAnswers) : {});
    } catch {
      setTopicAnswers({});
    }

    // Restore previously saved habits if user comes back
    try {
      const savedHabits = JSON.parse(localStorage.getItem("serenescape_selfcare") || "[]");
      setHabits(Array.isArray(savedHabits) ? savedHabits : []);
    } catch {
      setHabits([]);
    }
  }, []);

  const title = useMemo(() => TOPIC_TITLES[topic] || "Your Plan", [topic]);

  const addHabit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setHabits((prev) => {
      const next = [...prev, trimmed];
      localStorage.setItem("serenescape_selfcare", JSON.stringify(next));
      return next;
    });

    setInput("");
  };

  const removeHabit = (index) => {
    setHabits((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem("serenescape_selfcare", JSON.stringify(next));
      return next;
    });
  };

  const onContinue = () => {
    // Make sure we persist latest habits even if user didn’t press "+"
    if (input.trim()) {
      const next = [...habits, input.trim()];
      localStorage.setItem("serenescape_selfcare", JSON.stringify(next));
    }

    navigate("/tasks");
  };

  return (
    <div className="Quiz2">
      <div className="Quiz2Card">
        <button className="BackBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="Quiz2Title">I take care of myself by…</h1>
        <p className="Quiz2Subtitle">
          Topic: <b>{title}</b>
        </p>

        {/* Optional: tiny preview so it feels “personalized” */}
        {Object.keys(topicAnswers).length > 0 && (
          <div className="PreviewBox">
            <div className="PreviewTitle">What you shared</div>
            <ul className="PreviewList">
              {Object.entries(topicAnswers)
                .filter(([_, v]) => String(v || "").trim())
                .slice(0, 3)
                .map(([k, v]) => (
                  <li key={k}>{v}</li>
                ))}
            </ul>
          </div>
        )}

        <div className="InputRow">
          <input
            className="Quiz2Input"
            type="text"
            placeholder="Type one habit (e.g., a 10-min walk)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
          />
          <button className="AddBtn" onClick={addHabit} aria-label="Add habit">
            +
          </button>
        </div>

        {habits.length > 0 && (
          <div className="Chips">
            {habits.map((h, idx) => (
              <div className="Chip" key={`${h}-${idx}`}>
                <span className="ChipText">{h}</span>
                <button className="ChipX" onClick={() => removeHabit(idx)} aria-label="Remove">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="ContinueBtn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default QuizPage2;
