import {
  pollState,
  createPoll,
  submitAnswer,
  getPollResults,
  resetPoll,
  getHistory,
} from "../utils/store.js";

export default function handlePollSocket(io) {
  io.on("connection", (socket) => {
    console.log("📡 New client connected:", socket.id);

    // Poll creation
    socket.on("create_poll", ({ question, options, duration = 60 }) => {
      if (pollState.currentPoll) {
        socket.emit("error", "A poll is already active.");
        return;
      }

      createPoll(question, options, duration);

      io.emit("poll_started", {
        question,
        options,
        duration,
        createdAt: pollState.currentPoll.createdAt,
      });

      pollState.timeout = setTimeout(() => {
        const results = getPollResults();
        io.emit("poll_results", results);
        resetPoll();
      }, duration * 1000);
    });

    // Student submits answer
    socket.on("submit_answer", ({ studentId, answer }) => {
      if (!pollState.currentPoll) {
        socket.emit("error", "No active poll.");
        return;
      }

      if (pollState.answers[studentId]) {
        socket.emit("error", "You already answered.");
        return;
      }

      submitAnswer(studentId, answer);
      socket.emit("answer_received");
    });

    // Get results for current poll
    socket.on("get_results", () => {
      const results = getPollResults();
      socket.emit("poll_results", results);
    });

    // Get session poll history
    socket.on("get_history", () => {
      const history = getHistory();
      socket.emit("poll_history", history);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
