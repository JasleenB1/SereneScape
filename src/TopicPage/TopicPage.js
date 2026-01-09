import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import "./TopicPage.css";

const QUIZ_BY_TOPIC = {
  anxiety: {
    title: "Anxiety",
    subtitle: "Let’s personalize a calm plan for you.",
    questions: [
      { id: "trigger", prompt: "What usually triggers your anxiety?" },
      { id: "signals", prompt: "How do you notice it (thoughts/body signs)?" },
      { id: "helps", prompt: "What has helped even a little before?" },
    ],
  },
  depression: {
    title: "Depression",
    subtitle: "Let’s build small steps that feel doable.",
    questions: [
      { id: "energy", prompt: "How has your energy been lately?" },
      { id: "sleep", prompt: "How has your sleep been?" },
      { id: "smallWin", prompt: "What’s one small win you want this week?" },
    ],
  },
  "time-management": {
    title: "Time Management",
    subtitle: "Let’s make your week feel lighter and more controlled.",
    questions: [
      { id: "blocker", prompt: "What’s your biggest time blocker right now?" },
      { id: "deadline", prompt: "What’s the most urgent thing on your plate?" },
      { id: "routine", prompt: "When do you focus best (morning/afternoon/night)?" },
    ],
  },
  communication: {
    title: "Communication",
    subtitle: "Let’s help you feel clearer and more confident.",
    questions: [
      { id: "situation", prompt: "What situation do you want to communicate better in?" },
      { id: "hardPart", prompt: "What’s hardest (confidence, conflict, clarity, boundaries)?" },
      { id: "success", prompt: "What would success look like?" },
    ],
  },
  studying: {
    title: "Studying",
    subtitle: "Let’s build a study plan that actually sticks.",
    questions: [
      { id: "subject", prompt: "What are you studying for right now?" },
      { id: "struggle", prompt: "What’s the biggest struggle (focus, time, motivation)?" },
      { id: "method", prompt: "What study method have you tried so far?" },
    ],
  },
  other: {
    title: "Other",
    subtitle: "Tell us what’s going on — we’ll tailor it.",
    questions: [
      { id: "topic", prompt: "What do you want help with?" },
      { id: "context", prompt: "What’s the context?" },
      { id: "goal", prompt: "What’s your goal for the next 7 days?" },
    ],
  },
};

export default function TopicPage() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const config = useMemo(() => (topic ? QUIZ_BY_TOPIC[topic] : null), [topic]);
  const [answers, setAnswers] = useState({});

  if (!topic || !config) return <Navigate to="/" replace />;

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const onContinue = () => {
    // Save topic + answers so QuizPage2 / dashboard can use them
    localStorage.setItem("serenescape_topic", topic);
    localStorage.setItem("serenescape_topic_answers", JSON.stringify(answers));

    navigate("/quiz2");
  };

  return (
    <div className="TopicPage">
      <div className="TopicCard">
        <button className="BackBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="Title">{config.title}</h1>
        <p className="Subtitle">{config.subtitle}</p>

        <div className="Questions">
          {config.questions.map((q) => (
            <div className="Question" key={q.id}>
              <label className="Label">{q.prompt}</label>
              <textarea
                className="Input"
                rows={3}
                value={answers[q.id] || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Type here…"
              />
            </div>
          ))}
        </div>

        <button className="ContinueBtn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
