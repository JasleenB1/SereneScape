import React from "react";
import "./QuizPage.css";
import TopicButton from "../TopicButton/TopicButton";

import anxietyImg from "./quizPageimages/anxietyImage.png";
import depressionImg from "./quizPageimages/depressionImage.png";
import timeImg from "./quizPageimages/timeImage.png";
import communicationImg from "./quizPageimages/communicationImage.png";
import studyingImg from "./quizPageimages/studyingImage.png";
import otherImg from "./quizPageimages/otherImage.png";

function QuizPage() {
  return (
    <div className="QuizPage">
      <div className="content">
        <h1 className="heading">I need help with…</h1>

        <div className="topicGrid">
          <TopicButton topic="anxiety" label="Anxiety" image={anxietyImg} />
          <TopicButton topic="depression" label="Depression" image={depressionImg} />
          <TopicButton topic="time-management" label="Time Management" image={timeImg} />
          <TopicButton topic="communication" label="Communication" image={communicationImg} />
          <TopicButton topic="studying" label="Studying" image={studyingImg} />
          <TopicButton topic="other" label="Other" image={otherImg} />
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
