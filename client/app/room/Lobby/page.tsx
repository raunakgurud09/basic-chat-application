"use client"

import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketProvider'
import React, { useCallback, useEffect, useState } from 'react'


export default function Lobby() {

  const [email, setEmail] = useState("")
  const [room, setRoom] = useState("")

  const { socket } = useSocket()

  const handleSubmit = () => {
    console.log(email, room)
    if (!socket) throw new Error("lobby: socket not ready")
    socket.emit("room:join", { email, room })
  }

  const router = useRouter()

  const handleRoomJoin = useCallback(({ email, room }: { email: string, room: string }) => {
    router.push(`/room/${room}`)
  }, [router])
  

  useEffect(() => {

    if (!socket) return;
    socket.on("room:join", handleRoomJoin)

    return () => {
      socket.off("room:join", handleRoomJoin)
    }
  }, [socket, handleRoomJoin])



  return (
    <div className='flex justify-center items-center h-96 flex-col '>
      <input
        type="text"
        placeholder='email'
        onChange={(e) => setEmail(e.target.value)}
        className='m-1 p-1 border-black rounded-sm text-black'
      />
      <input
        type="text"
        placeholder='roomId'
        onChange={(e) => setRoom(e.target.value)}
        className='m-1 p-1 border-black rounded-sm text-black'
      />

      <button
        onClick={handleSubmit}
        className='bg-white mt-5 px-6 py-2 rounded-sm text-black '
      >
        join
      </button>
    </div>
  )
}
