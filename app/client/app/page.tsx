"use client"

import { useSocket } from "@/context/SocketProvider"
import { useState } from "react"

export default function Home() {
  const { messages, sendMessage } = useSocket()
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message === "") return;
    console.log()
    setMessage('');
    sendMessage(message)
  }


  return (
    <div className="m-10 h-[600px] flex flex-col border-2 rounded-md border-white p-2">
      <div className="h-full overflow-y-auto flex flex-col p-2 overflow-x-hidden gap-1">
        {messages.map(msg => (
          <p
            key={msg}
            className="w-fit text-wrap bg-white text-black font-medium px-2 py-1 rounded-md"
          >
            {msg}
          </p>
        ))}
      </div>
      <div className="flex ">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          value={message}
          placeholder="message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          className="bg-zinc-700 w-full px-6 py-2 rounded-md"
        />
        <button
          onClick={() => handleSubmit()}
          className="px-6 py-2 border-2 border-white rounded-md"
        >
          send
        </button>
      </div>
    </div >
  )
}
