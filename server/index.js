import cors from "cors";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import setupSocket from "./sockets/socket.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Polling server is live 🎯");
});
setupSocket(io);


server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
