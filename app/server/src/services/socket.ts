import { Server } from "socket.io";
import Redis from "ioredis";

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

const pub = new Redis();
const sub = new Redis();

class SocketService {
  private _io: Server;

  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["*"],
      },
    });

    sub.subscribe("MESSAGE");
  }

  public initListeners() {
    const io = this._io;
    io.on("connect", async (socket) => {
      console.log(`⚡ userId ${socket.id} connected`);

      socket.on("event:message", async (msg) => {
        console.log("message from server", msg);

        await pub.publish("MESSAGE", JSON.stringify(msg));
        // io.emit("message", JSON.stringify(msg));
      });
      socket.on("room:join", ({ email, room }) => {
        console.log(`room join by ${email}`);

        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmailMap.set(socket.id, email);

        // event to inform other user in same room
        io.to(room).emit("user:joined", { email, id: socket.id });

        // join the room for further emits in room
        socket.join(room);

        // signaling response to confirm received email and room
        io.to(socket.id).emit("room:join", { email, room });
      });

      socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", { from: socket.id, offer });
      });

      socket.on("call:accepted", ({ to, ans }) => {
        console.log("call:accepted");
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });

      socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });

      socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });

      socket.on("disconnect", () => {
        console.log(`🚫 userId ${socket.id} disconnected`);
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGE") {
        console.log("message from redis", message);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
