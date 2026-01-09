import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const TOPIC_TITLES = {
  anxiety: "Anxiety",
  depression: "Depression",
  "time-management": "Time Management",
  communication: "Communication",
  studying: "Studying",
  other: "Other",
};

// ====== BADGES + LEADERBOARD (demo, localStorage) ======
const BADGE_DEFS = [
  { id: "streak_1", label: "🌱 Day 1", desc: "Started your journey", rule: (s) => s.streak >= 1 },
  { id: "streak_3", label: "🔥 3-Day Streak", desc: "Consistency is growing", rule: (s) => s.streak >= 3 },
  { id: "streak_7", label: "🌊 7-Day Flow", desc: "A full week of care", rule: (s) => s.streak >= 7 },
  { id: "streak_14", label: "🌿 14-Day Resilience", desc: "Two weeks strong", rule: (s) => s.streak >= 14 },
  { id: "actions_5", label: "✅ 5 Check-ins", desc: "Completed 5 days", rule: (s) => s.totalCheckIns >= 5 },
  { id: "actions_15", label: "🏅 15 Check-ins", desc: "Completed 15 days", rule: (s) => s.totalCheckIns >= 15 },
];

const DEFAULT_FRIENDS = [
  { id: "alex", name: "Alex", streak: 2, points: 40 },
  { id: "sam", name: "Sam", streak: 4, points: 75 },
  { id: "lisa", name: "Lisa", streak: 1, points: 18 },
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("other");
  const [answers, setAnswers] = useState({});
  const [selfCare, setSelfCare] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({ daily: "", weekly: "", monthly: "" });

  const [streak, setStreak] = useState(0);
  const [totalCheckIns, setTotalCheckIns] = useState(0);

  // badges + friends
  const [badges, setBadges] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("serenescape_topic") || "other";
    const a = readJSON("serenescape_topic_answers", {});
    const sc = readJSON("serenescape_selfcare", []);
    const tasks = readJSON("serenescape_selected_tasks", { daily: "", weekly: "", monthly: "" });

    const s = Number(localStorage.getItem("serenescape_streak") || 0);
    const total = Number(localStorage.getItem("serenescape_total_checkins") || 0);

    setTopic(t);
    setAnswers(a);
    setSelfCare(sc);
    setSelectedTasks(tasks);

    setStreak(s);
    setTotalCheckIns(total);

    // friends
    const storedFriends = readJSON("serenescape_friends", [DEFAULT_FRIENDS]);
    setFriends(storedFriends);

    // badges (sync on load so it's consistent)
    const earned = new Set(readJSON("serenescape_badges", []));
    const snapshot = { streak: s, totalCheckIns: total };
    BADGE_DEFS.forEach((b) => {
      if (!earned.has(b.id) && b.rule(snapshot)) earned.add(b.id);
    });
    const earnedArr = Array.from(earned);
    writeJSON("serenescape_badges", earnedArr);
    setBadges(earnedArr);
  }, []);

  const title = TOPIC_TITLES[topic] || "Your Plan";

  const quickInsight = useMemo(() => {
    const vals = Object.values(answers)
      .map((v) => String(v || "").trim())
      .filter(Boolean);
    return vals.length ? vals[0] : "";
  }, [answers]);

  const earnedBadgeObjects = useMemo(() => {
    const earned = new Set(badges);
    return BADGE_DEFS.filter((b) => earned.has(b.id));
  }, [badges]);

  const nextBadges = useMemo(() => {
    const earned = new Set(badges);
    return BADGE_DEFS.filter((b) => !earned.has(b.id)).slice(0, 3);
  }, [badges]);

  const leaderboard = useMemo(() => {
    const me = { id: "me", name: "You", streak, points: totalCheckIns * 10 };
    const list = [me, ...(friends || [])];
    return list.sort((a, b) => (b.streak - a.streak) || (b.points - a.points));
  }, [friends, streak, totalCheckIns]);

  const completeToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    const last = localStorage.getItem("serenescape_last_checkin");

    if (last === today) return; // already checked in today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = last === yesterday ? streak + 1 : 1;
    const nextTotal = totalCheckIns + 1;

    localStorage.setItem("serenescape_last_checkin", today);
    localStorage.setItem("serenescape_streak", String(nextStreak));
    localStorage.setItem("serenescape_total_checkins", String(nextTotal));

    setStreak(nextStreak);
    setTotalCheckIns(nextTotal);

    // Award badges immediately
    const snapshot = { streak: nextStreak, totalCheckIns: nextTotal };
    const earned = new Set(readJSON("serenescape_badges", []));
    BADGE_DEFS.forEach((b) => {
      if (!earned.has(b.id) && b.rule(snapshot)) earned.add(b.id);
    });
    const earnedArr = Array.from(earned);
    writeJSON("serenescape_badges", earnedArr);
    setBadges(earnedArr);
  };

  const addFriend = () => {
    const name = friendName.trim();
    if (!name) return;

    const newFriend = {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name,
      streak: Math.floor(Math.random() * 6) + 1, // demo data
      points: Math.floor(Math.random() * 120) + 10, // demo data
    };

    const next = [newFriend, ...(friends || [])];
    writeJSON("serenescape_friends", next);
    setFriends(next);
    setFriendName("");
  };

  const removeFriend = (id) => {
    const next = (friends || []).filter((f) => f.id !== id);
    writeJSON("serenescape_friends", next);
    setFriends(next);
  };

  const resetPlan = () => {
    localStorage.removeItem("serenescape_topic");
    localStorage.removeItem("serenescape_topic_answers");
    localStorage.removeItem("serenescape_selfcare");
    localStorage.removeItem("serenescape_selected_tasks");

    // keep friends optionally; remove if you want a full reset:
    // localStorage.removeItem("serenescape_friends");

    // reset badges/stats
    localStorage.removeItem("serenescape_badges");
    localStorage.removeItem("serenescape_streak");
    localStorage.removeItem("serenescape_total_checkins");
    localStorage.removeItem("serenescape_last_checkin");

    navigate("/");
  };

  return (
    <div className="Dash">
      <div className="DashCard">
        <div className="DashTop">
          <div>
            <h1 className="DashTitle">Welcome back</h1>
            <p className="DashSubtitle">
              Focus area: <b>{title}</b>
            </p>
          </div>

          <div className="StreakPill" title="Daily streak">
            🔥 <b>{streak}</b> day streak
          </div>
        </div>

        {quickInsight && (
          <div className="Insight">
            <div className="InsightTitle">Your why (from the quiz)</div>
            <div className="InsightBody">{quickInsight}</div>
          </div>
        )}

        <div className="Grid">
          <SectionCard
            title="Today"
            subtitle="One small action is enough."
            items={[selectedTasks.daily || "Pick a daily task in Tasks page"]}
            actionLabel="Edit tasks"
            onAction={() => navigate("/tasks")}
          />

          <SectionCard
            title="This week"
            subtitle="Keep it realistic."
            items={[selectedTasks.weekly || "Pick a weekly task in Tasks page"]}
            actionLabel="Edit tasks"
            onAction={() => navigate("/tasks")}
          />

          <SectionCard
            title="This month"
            subtitle="Bigger progress, slowly."
            items={[selectedTasks.monthly || "Pick a monthly task in Tasks page"]}
            actionLabel="Edit tasks"
            onAction={() => navigate("/tasks")}
          />
        </div>

        {/* ===== Bottom: Badges + Leaderboard ===== */}
        <div className="BottomGrid">
          {/* BADGES */}
          <div className="MiniCard">
            <div className="MiniTitle">Badges</div>

            {earnedBadgeObjects.length ? (
              <div className="BadgesRow">
                {earnedBadgeObjects.slice(0, 6).map((b) => (
                  <div className="Badge" key={b.id} title={b.desc}>
                    <div className="BadgeLabel">{b.label}</div>
                    <div className="BadgeDesc">{b.desc}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="MiniMuted">Do one check-in to earn your first badge 🌱</p>
            )}

            <div className="MiniMuted" style={{ marginTop: 10 }}>
              Next up:
              {nextBadges.length ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  {nextBadges.map((b) => (
                    <li key={b.id}>{b.label}</li>
                  ))}
                </ul>
              ) : (
                <span> You’ve earned everything available!</span>
              )}
            </div>
          </div>

          {/* LEADERBOARD */}
          <div className="MiniCard">
            <div className="MiniTitle">Friends Progress (demo)</div>
            <p className="MiniMuted">
              Demo friends included for visualization only. Add or remove names to simulate progress.
            </p>

            <div className="Leaderboard">
              {leaderboard.slice(0, 6).map((p, idx) => (
                <div className="LeaderRow" key={p.id}>
                  <div className="LeaderLeft">
                    <div className="Rank">{idx + 1}</div>
                    <div>
                      <div className="LeaderName">{p.name}</div>
                      <div className="LeaderMeta">{p.points} points</div>
                    </div>
                  </div>

                  <div className="LeaderRight">
                    <span className="StreakChip">🔥 {p.streak}d</span>
                    {p.id !== "me" && (
                      <button className="TinyBtn" onClick={() => removeFriend(p.id)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="AddFriendRow">
              <input
                className="FriendInput"
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Add friend name…"
              />
              <button className="AddFriendBtn" onClick={addFriend}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ===== Check-in row (keep) ===== */}
        <div className="BottomGrid" style={{ marginTop: 14 }}>
          <div className="MiniCard">
            <div className="MiniTitle">Your self-care list</div>
            {selfCare?.length ? (
              <ul className="MiniList">
                {selfCare.slice(0, 6).map((h, i) => (
                  <li key={`${h}-${i}`}>{h}</li>
                ))}
              </ul>
            ) : (
              <p className="MiniMuted">Add self-care habits on the previous screen.</p>
            )}
            <button className="MiniBtn" onClick={() => navigate("/quiz2")}>
              Add habits
            </button>
          </div>

          <div className="MiniCard">
            <div className="MiniTitle">Check-in</div>
            <p className="MiniMuted">
              Tap once after you do your daily task. This updates your streak.
            </p>
            <button className="PrimaryBtn" onClick={completeToday}>
              ✅ Mark today done
            </button>

            <button className="DangerBtn" onClick={resetPlan}>
              Reset plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, items, actionLabel, onAction }) {
  return (
    <div className="SectionCard">
      <div className="SectionHeader">
        <div>
          <div className="SectionTitle">{title}</div>
          <div className="SectionSub">{subtitle}</div>
        </div>
        <button className="GhostBtn" onClick={onAction}>
          {actionLabel}
        </button>
      </div>

      <ul className="TaskList">
        {items.map((t, idx) => (
          <li key={`${t}-${idx}`}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
