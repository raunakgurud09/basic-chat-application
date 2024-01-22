"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
const pub = new ioredis_1.default();
const sub = new ioredis_1.default();
class SocketService {
    constructor() {
        console.log("init socket server");
        this._io = new socket_io_1.Server({
            cors: {
                origin: "http://localhost:3000",
                allowedHeaders: ["*"],
            },
        });
        sub.subscribe("MESSAGE");
    }
    initListeners() {
        const io = this._io;
        io.on("connect", (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`⚡ userId ${socket.id} connected`);
            socket.on("event:message", (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log("message from server", msg);
                yield pub.publish("MESSAGE", JSON.stringify(msg));
                // io.emit("message", JSON.stringify(msg));
            }));
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
        }));
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
exports.default = SocketService;
