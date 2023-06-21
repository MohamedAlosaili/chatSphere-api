import { Server } from "http";
import SocketIO from "socket.io";
import Member from "./models/Member";

const socketIO = (server: Server) => {
  const io = new SocketIO.Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? process.env.DEV_CLIENT_URL
          : process.env.PROD_CLIENT_URL,
    },
  });

  io.on("connection", socket => {
    // console.log("User connected");
    socket.on("new message", async (roomId: string) => {
      io.emit(`room-${roomId}`);

      const members = await Member.find({ roomId });
      const memberIds = members.map(member => String(member.memberId));

      memberIds.forEach(id => io.emit(id));
    });

    socket.on("update online", () => {
      socket.broadcast.emit("update online");
    });

    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });
  });
};

export default socketIO;
