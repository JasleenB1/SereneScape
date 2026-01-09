import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TasksPage.css";

const TOPIC_TITLES = {
  anxiety: "Anxiety",
  depression: "Depression",
  "time-management": "Time Management",
  communication: "Communication",
  studying: "Studying",
  other: "Other",
};

const BASE_TASKS = {
  anxiety: {
    daily: [
      "2-minute box breathing",
      "Write 1 worry → 1 next step",
      "10-minute walk (no phone)",
    ],
    weekly: [
      "Plan 1 low-stress social moment",
      "Declutter one small space (5–10 min)",
      "Try one guided meditation",
    ],
    monthly: [
      "Review anxiety triggers and patterns",
      "Create a ‘calm kit’ list (music, tea, notes)",
      "Set one boundary you’ve been avoiding",
    ],
  },
  depression: {
    daily: [
      "Open curtains + drink water",
      "5-minute stretch",
      "Message one friend (even a meme)",
    ],
    weekly: [
      "Schedule one enjoyable activity",
      "Meal prep one easy meal",
      "Clean 1 small area (10 min)",
    ],
    monthly: [
      "Reflect on mood trends and supports",
      "Try a new hobby session",
      "Plan one day with extra rest",
    ],
  },
  "time-management": {
    daily: [
      "Pick Top 3 tasks for today",
      "25-minute focus sprint (Pomodoro)",
      "2-minute desk reset",
    ],
    weekly: [
      "Plan your week in 15 minutes",
      "Batch errands into one block",
      "Review what wasted time last week",
    ],
    monthly: [
      "Reset goals + calendar",
      "Remove one recurring commitment",
      "Build a ‘default week’ template",
    ],
  },
  communication: {
    daily: [
      "Practice one clear ‘I feel / I need’ sentence",
      "Write a message draft before sending",
      "Pause 3 seconds before responding",
    ],
    weekly: [
      "Have one honest conversation you’ve delayed",
      "Set one boundary politely",
      "Ask for feedback from someone you trust",
    ],
    monthly: [
      "Reflect on a conflict and what you learned",
      "Improve one communication habit (interrupting, clarity)",
      "Write a ‘values’ list for relationships",
    ],
  },
  studying: {
    daily: [
      "25-minute study sprint",
      "Active recall: 10 questions",
      "Summarize notes in 5 bullets",
    ],
    weekly: [
      "Plan study blocks for the week",
      "Do one timed practice set",
      "Teach a concept out loud (Feynman)",
    ],
    monthly: [
      "Review weak topics and prioritize",
      "Rebuild your study system",
      "Set a realistic exam prep timeline",
    ],
  },
  other: {
    daily: ["Write one small next step", "5-minute reset", "One positive action for yourself"],
    weekly: ["Plan 1 improvement", "Ask for support", "Reflect on what worked"],
    monthly: ["Reset goals", "Remove one stressor", "Create a plan for next month"],
  },
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function TasksPage() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("other");
  const [selfCare, setSelfCare] = useState([]);
  const [selected, setSelected] = useState(() =>
    readJSON("serenescape_selected_tasks", { daily: "", weekly: "", monthly: "" })
  );

  useEffect(() => {
    const t = localStorage.getItem("serenescape_topic") || "other";
    setTopic(t);

    const habits = readJSON("serenescape_selfcare", []);
    setSelfCare(Array.isArray(habits) ? habits : []);
  }, []);

  const title = TOPIC_TITLES[topic] || "Your Plan";

  const options = useMemo(() => {
    const base = BASE_TASKS[topic] || BASE_TASKS.other;

    // Include the user’s self-care habits as extra options
    const habitOptions = selfCare.map((h) => `Self-care: ${h}`);

    return {
      daily: [...base.daily, ...habitOptions],
      weekly: [...base.weekly, ...habitOptions],
      monthly: [...base.monthly, ...habitOptions],
    };
  }, [topic, selfCare]);

  const setChoice = (bucket, value) => {
    setSelected((prev) => {
      const next = { ...prev, [bucket]: value };
      localStorage.setItem("serenescape_selected_tasks", JSON.stringify(next));
      return next;
    });
  };

  const onContinue = () => {
    // Next: could route to a dashboard page later
    navigate("/dashboard");
  };

  return (
    <div className="TasksPage">
      <div className="TasksCard">
        <button className="BackBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="TasksTitle">Tasks</h1>
        <p className="TasksSubtitle">
          Based on: <b>{title}</b>
        </p>

        <div className="TaskGrid">
          <TaskPicker
            label="Daily"
            value={selected.daily}
            onChange={(v) => setChoice("daily", v)}
            options={options.daily}
          />
          <TaskPicker
            label="Weekly"
            value={selected.weekly}
            onChange={(v) => setChoice("weekly", v)}
            options={options.weekly}
          />
          <TaskPicker
            label="Monthly"
            value={selected.monthly}
            onChange={(v) => setChoice("monthly", v)}
            options={options.monthly}
          />
        </div>

        <button className="ContinueBtn" onClick={onContinue}>
          <span className="Seed">🌱</span> Continue
        </button>
      </div>
    </div>
  );
}

function TaskPicker({ label, value, onChange, options }) {
  return (
    <div className="TaskSection">
      <h2 className="TaskHeading">{label}</h2>
      <select className="TaskDropdown" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose one…</option>
        {options.map((opt, idx) => (
          <option key={`${label}-${idx}`} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
