"use client"
import React, { createContext, use, useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

interface ISocketContext {
  messages: string[]
  socket: any
  sendMessage: (msg: string) => void
}


const SocketContext = createContext<ISocketContext | null>(null)

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<string[]>([])


  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg: string) => {
    console.log("sending msg...", msg)
    if (!socket) throw new Error("socket not ready")
    socket?.emit("event:message", { message: msg })
  }, [socket])


  const onMessageReceived = useCallback((msg: string) => {
    const { message } = JSON.parse(msg) as { message: string }
    setMessages((prev) => [...prev, message])
  }, [])


  useEffect(() => {
    const _socket = io("http://localhost:8000")

    _socket.on("message", onMessageReceived)

    setSocket(_socket)

    return () => {
      setSocket(undefined)
      _socket.disconnect();
      _socket.off("message", onMessageReceived)
    }
  }, [])



  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
