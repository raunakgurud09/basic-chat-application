import { Server } from "socket.io";

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
class SocketService {
  private _io: Server;
  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
  }

  public initListeners() {
    const io = this._io;
    io.on("connect", async (socket) => {
      console.log(`⚡ userId ${socket.id} connected`);

      socket.on("event:message", (msg) => {
        console.log("message received", msg);
        io.emit("message", JSON.stringify(msg));
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
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
