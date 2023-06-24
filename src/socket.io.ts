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

    socket.on("update room", async (roomId: string, type: string) => {
      if (type === "leave") {
        socket.broadcast.emit(`room-${roomId} info`);
      } else {
        io.emit(`room-${roomId} info`);
      }

      memberEmitter(roomId, io);
    });

    socket.on("update messages", async (roomId: string, memberId?: string) => {
      io.emit(`room-${roomId} messages`);
      memberEmitter(roomId, io, memberId);
    });

    socket.on("new message", async (roomId: string) => {
      socket.broadcast.emit(`room-${roomId} messages`);

      memberEmitter(roomId, socket.broadcast);
    });

    socket.on("update online", () => {
      socket.broadcast.emit("update online");
    });

    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });

    const memberEmitter = async (
      roomId: string,
      emitter: typeof io | typeof socket.broadcast,
      memberId?: string
    ) => {
      const members = await Member.find({ roomId });
      const memberIds = members.map(member => String(member.memberId));

      if (memberId) memberIds.push(memberId);

      memberIds.forEach(id => emitter.emit(id));
    };
  });
};

export default socketIO;
