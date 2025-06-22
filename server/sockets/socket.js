import {
  rooms,
  createPoll,
  createRoom,
  endPoll,
  getPollResults,
  getRoom,
} from "../utils/rooms.js";



export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("📡 New client connected:", socket.id);

    socket.on("teacher:create_room", ({ roomId, username }) => {
      const success = createRoom(socket.id, username, roomId);
      if (!success) {
        socket.emit("error", { message: "Room already exists" });
        return;
      }

      socket.join(roomId);
      socket.emit("room_created", { roomId });
      console.log(`Room created: ${roomId} by ${socket.id}`);
    });

    socket.on("teacher:create_poll",
      ({ roomId, question, options, duration = 60 }) => {
        const room = getRoom(roomId);
        if (!room) {
          socket.emit("error", "Room not found!");
          return;
        }

        if (room.currentPoll) {
          socket.emit("error", "A poll is already active");
          return;
        }

        createPoll(roomId, question, options, duration);

        io.to(roomId).emit("poll:started", {
          question,
          options,
          duration,
          createdAt: Date.now(),
        });

        room.timeout = setTimeout(() => {
          const results = getPollResults(roomId);
          io.to(roomId).emit("poll:ended", results);
          endPoll(roomId);
        }, duration * 1000);
        console.log(`📝 Poll started in room ${roomId}: ${question} ${duration}`);
      }
    );

    socket.on("student:join_room", ({ roomId, userId, username }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (room.students[userId]) {
        socket.emit("student:joined", {
          userId,
          username: room.students[userId].username,
        });
        return;
      } else {
        room.students[userId] = {
          username,
          socketId: socket.id,
          hasAnswered: false,
        };
        socket.join(roomId);
        socket.emit("student:joined", { userId, username });
        console.log(`Student ${username} (${userId}) joined room: ${roomId}`);
      }
    });

    socket.on("student:submit_answer", ({ roomId, userId, answer }) => {
      const room = getRoom(roomId);
      if (!room || !room.currentPoll) {
        socket.emit("error", "No active poll!");
        return;
      }

      const student = room.students[userId];
      if (!student) {
        socket.emti("error", "Student not found in the room!");
      }

      if (student.hasAnswered) {
        socket.emit("error", "Student has already submitted an answer!");
      }

      if (room.pollResults[answer] != undefined) {
        room.pollResults[answer] += 1;
      }

      student.hasAnswered = true;
      socket.emit("answer:recieved");

      const allAnswered = Object.values(room.students).every(
        (s) => s.hasAnswered
      );
      if (allAnswered) {
        const results = getPollResults(roomId);
        io.to(roomId).emit("poll:ended", results);
        endPoll(roomId);
      }
    });

    socket.on("teacher:get-history", ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", "Room not found!");
        return;
      }

      socket.emit("poll_history", room.history);
    });

    socket.on("teacher:kick-student", ({ roomId, userId }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", "Room not found!");
        return;
      }

      const student = room.students[userId];
      if (!student) {
        socket.emit("error", "Student not found!");
        return;
      }

      const kickedSocketId = student.socketId;
      io.to(kickedSocketId).emit("student:kicked", "student kicked!");
      delete room.students[userId];
      io.to(roomId).emit("room:student-kicked", { userId });
    });

    socket.on("chat:get-history", ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }

      socket.emit("chat:history", room.chat || []);
    });

    socket.on("chat:message", (roomId, userId, message) => {
      const room = getRoom(userId);
      if (!room) {
        socket.emit("error", "Room not found!");
        return;
      }

      const msg = {
        userId,
        username: room.students[userId]?.username || "Unknown",
        message,
        timestamp: Date.now(),
      };

      room.chat = room.chat || [];
      room.chat.push(msg);

      io.to(roomId).emit("chat:message", msg);
    });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        for (const [studentId, student] of Object.entries(room.students)) {
          if (student.socketId === socket.id) {
            delete room.students[studentId];
            io.to(roomId).emit("room:student-left", { studentId });
            break;
          }
        }
      }
    });
  });
}
