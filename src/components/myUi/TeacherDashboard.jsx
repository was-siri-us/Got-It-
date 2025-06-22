// components/myUi/TeacherDashboard.jsx
import { useState } from "react";
import socket from "../../sockets/socket";

const TeacherDashboard = ({ roomId, name }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [pollActive, setPollActive] = useState(false);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const startPoll = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please enter a question and all options.");
      return;
    }

    socket.emit("teacher:create_poll", {
      roomId,
      question,
      options,
      duration,
    });

    socket.on("poll:started", (data) => {
      console.log("Poll started:", data);
      setPollActive(true);
    });

    socket.on("error", (err) => {
      alert(err);
    });
  };

  return (
    <div className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Room ID: {roomId}</h2>
      <p className="mb-6 text-gray-600">Welcome, {name} 👋</p>

      {!pollActive ? (
        <>
          <h3 className="font-semibold text-lg mb-2">Create a new poll</h3>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((opt, idx) => (
            <input
              key={idx}
              className="border p-2 rounded w-full mb-2"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, idx)}
            />
          ))}
          <button
            className="text-blue-600 mb-2"
            onClick={addOption}
          >
            + Add Option
          </button>
          <div className="flex items-center mb-4 gap-2">
            <label>Duration (sec):</label>
            <input
              type="number"
              className="border p-1 rounded w-20"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
          <button
            className="bg-blue-600 text-white rounded px-4 py-2"
            onClick={startPoll}
          >
            Start Poll
          </button>
        </>
      ) : (
        <p className="text-green-600 font-semibold">
          ✅ Poll active! Waiting for responses...
        </p>
      )}
    </div>
  );
};

export default TeacherDashboard;
