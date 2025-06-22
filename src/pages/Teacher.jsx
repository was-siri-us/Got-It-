import { useState} from "react";
import socket from "../sockets/socket";
import TeacherStart from "../components/myUi/TeacherStart";
import TeacherDashboard from "../components/myUi/TeacherDashboard";

const Teacher = () => {
  const [name, setName] = useState("");
  const [roomId] = useState(crypto.randomUUID().slice(0, 8));
  const [roomCreated, setRoomCreated] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const createRoom = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    socket.connect();
    socket.emit("teacher:create_room", { roomId, username: name });

    socket.on("room_created", ({ roomId }) => {
      console.log(`Room created with ID: ${roomId}`);
      setRoomCreated(true);
    });

    socket.on("error", (error) => {
      console.error("Error creating room:", error.message);
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      {!roomCreated ? (
        <TeacherStart
          name={name}
          handleNameChange={handleNameChange}
          startSession={createRoom}
        />
      ) : (
        <TeacherDashboard roomId={roomId} name={name} />
      )}
    </div>
  );
};

export default Teacher;
