"use client"

import { useSocket } from "@/context/SocketProvider"
import { useEffect, useState } from "react"

export default function Home() {
  const { messages, socket, sendMessage } = useSocket()
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    console.log()
    setMessage('');
    sendMessage(message)
  }

  useEffect(() => {

    if (!socket) { console.log('socket not ready'); return; }

  }, [])



  return (
    <div className="m-10 flex flex-col">
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          value={message}
          placeholder="message..."
          className="text-black"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
        />
        <button onClick={() => handleSubmit()}>send</button>
      </div>
      <div>
        {messages.map(msg => (
          <li key={msg}>
            {msg}
          </li>
        ))}
      </div>
    </div >
  )
}
