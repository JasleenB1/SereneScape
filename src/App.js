import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import QuizPage from "./QuizPage/QuizPage";
import QuizPage2 from "./QuizPage2/QuizPage2";
import TasksPage from "./TasksPage/TasksPage";
import TopicPage from "./TopicPage/TopicPage";
import DashboardPage from "./DashboardPage/DashboardPage";


function NotFound() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>404</h1>
      <p>Route not found.</p>
      <p>
        Go back to <a href="/">Home</a>
      </p>
    </div>
  );
}

function App() {
  console.log("✅ APP.JS LOADED");

  return (
    <Router>
      <Routes>
        <Route
          path="/__debug"
          element={<div style={{ padding: 40 }}>DEBUG ROUTE WORKS ✅</div>}
        />

        <Route path="/" element={<QuizPage />} />
        <Route path="/quiz2" element={<QuizPage2 />} />
        <Route path="/tasks" element={<TasksPage />} />
        {/* <Route path="/coral" element={<CoralPage />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />


        <Route path="/help/:topic" element={<TopicPage />} />

        {/* Old routes redirect */}
        <Route path="/AnxietyButton" element={<Navigate to="/help/anxiety" replace />} />
        <Route path="/DepressionButton" element={<Navigate to="/help/depression" replace />} />
        <Route path="/TimeManagementButton" element={<Navigate to="/help/time-management" replace />} />
        <Route path="/CommunicationButton" element={<Navigate to="/help/communication" replace />} />
        <Route path="/StudyingButton" element={<Navigate to="/help/studying" replace />} />
        <Route path="/OtherButton" element={<Navigate to="/help/other" replace />} />
        

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
