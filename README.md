# Websockets Unlocked

## To setup project locally

- [setup](/setup.md)

Hey there! 🌟 Ready to dive into the exciting world of real-time communication with WebSocket? 🚀 Join me in this series where we'll start from the basics, craft awesome chat/video apps, and master scaling with Redis and Kafka. Get set for a journey filled with interactive learning! 🌐💬✨ #RealTimeWeb #WebSocketAdventures

Learning about websockets can be a bit tricky at first, but once you get the hang of it, it becomes quite easy. I would definitely recommend taking the time to learn about websockets, as they are an essential part of modern web development and can greatly enhance the real-time capabilities of your applications. Plus, mastering websockets opens up a whole new world of possibilities for interactive and dynamic web experiences. So, don't be discouraged by the initial challenges – the rewards of learning websockets are well worth the effort!

This blog serves as an introduction to websockets, explaining what they are and why you should consider building your application using websockets. It also covers the difference between http and websockets, as well as the benefits of using websockets.

You can only learn by building so in this blog we will also learn how to build a basic message application using websockets with Socket.io, Node.js, and React.

## What is websocket

WebSockets are a communication protocol that provides full-duplex communication channels over a single, long-lived connection. Unlike traditional HTTP connections, which are stateless and involve the client making a request and the server responding, WebSockets allow for bidirectional communication between the client and server. This is built on top of TCP/IP, which means it is reliable and ensures that every packet is received.

HTTP is like sending letters where you ask for something, and then you wait for a reply. WebSocket is like having a phone call where you can talk back and forth instantly. Chat applications, online gaming, financial platforms, and live streaming is build using websockets.

![Basic working_of_websocket](./images/basic_working_of_websocket.png)

let's look at some benefits of websocket

- Full-duplex Communication can be imagine like using walkie-talkies where you and your friend can talk and listen at the same time. Full-duplex is like having a chat where both can speak without waiting, and that's how WebSockets let computers talk back and forth instantly.

- Persistent Connection means once you connect your device to the internet (or a server), the link stays open as long as needed. It's like staying on a call without hanging up, making communication faster and more efficient.

- Low Latency means there's minimal delay when sending and receiving information. It's like a really fast text conversation,

> WebSockets use a ws:// or wss:// URI scheme, where ws stands for WebSocket and wss is WebSocket Secure (encrypted using TLS/SSL).

## Playing with websockets

You might be asking where can you start using WebSocket and how can you use this well, Modern web browsers provide a WebSocket API that allows developers to work with WebSockets using JavaScript. This API includes methods for opening a WebSocket connection, sending and receiving messages, and handling events.

[wss://ws.postman-echo.com/raw](wss://ws.postman-echo.com/raw)*.
(postman echo websocket server)

Open a web browser (Chrome, Edge, Safari, Brave) and type ctrl + shift + i to open the developer tools. Then, go to the console tab and write the following command.

As you can see, we are creating a variable called "socket" which has a URL (echo wss). We are also defining a function which will respond to the data received on the socket. We are sending a message using the "socket.send()" method.

```javascript
    // Create a variable called socket with a URL (echo wss)
    let socket = new WebSocket("wss://ws.postman-echo.com/raw");

    // Define a function to respond to the data received on the socket
    socket.onmessage = function(event) {
      console.log('Message received: ' + event.data);
    };

    // Send a message using the socket.send() method
    socket.send('Hello, server!');
```

![Wss connection in console](./images/console_wss_1.png)

Now, move to the network tab and find the raw name response. You can see that this raw response is of type websocket.

Clicking on raw will allow you to see additional information about the request, such as the status code and headers.

![Wss connection in console](./images/console_wss_2.png)

Click on the message tab to view all the WebSocket messages that have been sent and received. The UpArrow denotes the message sent by us, while the DownArrow denotes the message received. Since we are using an echo server, we are getting the same response (refer to the previous image).

![Wss connection in console](./images/console_wss_3.png)

Go ahead and try this out on your own and experiment with it. You can also learn more about the WebSocket API on the [MND documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

## Building a simple chat application

Learning without building is not effective, which is why we are going to create a simple chat application where users can send and receive messages in real time.

// TODO: src code // add link of github

![Wss connection in console](./images/basic_chat-app.png)

This is a basic app without any proper UI. We will build the proper UI in future blogs. Let's start coding.

Make sure you have node installed

```bash
  node --version
```

I am using Node.js version v20.10.0. Any version above v18.17 should work.

Create the project folder containing two sub-folders named client and server.

```bash
  mkdir chat-app
  cd chat-app
  mkdir client server
```

![Wss connection in console](./images/folder_structure.png)

### Server

Next, navigate into the server folder and create a package.json file.

```bash
cd server
npm init -y
```

Install [Socket.io](https://socket.io) Server API,We would be using TypeScript for a better developer experience (DX) and take advantage of tsc-watch for constant reloading.

```bash
# Add socket.io

npm add socket.io

# Add dev dependencies

npm add -D tsc-watch typescript

# Preinstalled tsc globally

tsc --init

# Change tsconfig.json

"rootDir": "./src",
"outDir": "./dist",

# start the server in dev

npm dev
```

set scripts

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "tsc-watch --onSuccess \"node dist/index.js\"",
    "build": "tsc -p .",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "tsc-watch": "^6.0.4",
    "typescript": "^5.3.3"
  }
}
```

Create a basic server using the built-in http module and start the server.

```javascript
# index.ts

import http from "http";

async function init() {
  const httpServer = await http.createServer();
  
  const PORT = process.env.PORT ? process.env.PORT : 8000;
  
  httpServer.listen(PORT, () => {
    console.log(`http server started at ${PORT}...`);
  });
}

init();
```

```bash
npm run dev
```

Now, in the src folder, create a folder named "services" and inside it, create a file named "socket.ts" under the "services" folder.

```javascript
# services/socket.ts

import { Server } from "socket.io";

class SocketService {

  // Create a variable _io with type Server from socket.io
  private_io: Server;

  constructor() {
    // Log a message when the SocketService is initialized
    console.log("init socket server");

    // Setup CORS policy to allow all ('*')
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
  }

  // Initialize event listeners for the socket connection
  public initListeners() {
    // Get a reference to the _io instance
    const io = this._io;

    // Event listener for when a client connects to the WebSocket server
    io.on("connect", async (socket) => {
      // Log a message when a client connects, including their socket id
      console.log(`⚡ userId ${socket.id} connected`);

      // Log a message when socket user is disconnected
      socket.on("disconnect", () => {
        console.log(`🚫 userId ${socket.id} disconnected`);
      });
    });
  }

  // Getter method to access the _io instance from outside the class
  get io() {
    return this._io;
  }
}

// Export the SocketService class as the default export of this module
export default SocketService;
```

initListeners() method: This method initializes event listeners for the WebSocket server. In this case, it sets up a listener for the "connect" event, which fires when a client connects to the server. It logs a message indicating the user id (socket id) of the connected client.

get io() method : This getter method allows external components to access the _io instance from outside the class.

Add a event listener for message event

```javascript
// Event listener for "event:message"
socket.on("event:message", (msg) => {
  // Log the received message to the server console
  console.log("message received", msg);

  // Emit a "message" event to all clients with the received message
  io.emit("message", JSON.stringify(msg));
});
```

```javascript
# index.ts

import http from "http";
// import socket service
import SocketService from "./services/socket";

async function init() {
  const httpServer = await http.createServer();

  // initializing the socket server
  const socketService = new SocketService();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  // attaching the server to the SocketService
  socketService.io.attach(httpServer);
  
  httpServer.listen(PORT, () => {
    console.log(`http server started at ${PORT}...`);
  });

  // initialize the socket listeners
  socketService.initListeners();
}

init();
```

start the server

```bash
npm run dev
```

server work is done here🥳🥳

### Client

Navigate to the client folder using your terminal and then create a new Next.js project with Tailwind CSS and TypeScript.

learn more about

- Next.js
- typescript
- tailwindcss

```bash
cd client
npx create-next-app@latest ./
```

Install socket.io-client, socket.io a library that provides an abstraction layer on top of WebSockets, simplifying the process of creating real-time applications.

```bash
npm install socket.io-client
```

Create a folder called context and add a file SocketProvider.tsx. This file serves as a wrapper around the app, allowing us to use the socket from anywhere within the app.

working with node react and socket.io

```javascript
# context/SocketProvider.tsx

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

// Interface defining the structure of the SocketContext
interface ISocketContext {
  messages: string[]
  socket: any
  sendMessage: (msg: string) => void
}

const SocketContext = createContext<ISocketContext | null>(null)

// Custom hook for easily accessing the socket context
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // State to hold the socket instance
  const [socket, setSocket] = useState<Socket>()
  // To hold all messages in socket connection
  const [messages, setMessages] = useState<string[]>([])

  // function to send a message from chat
  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg: string) => {
    console.log("sending msg...", msg)
    if (!socket) throw new Error("socket not ready")
    // emit event to send message from socket
    socket?.emit("event:message", { message: msg })
  }, [socket])

  const onMessageReceived = useCallback((msg: string) => {
    const { message } = JSON.parse(msg) as { message: string }
    // Set the msg received in the messages state
    setMessages((prev) => [...prev, message])
  }, [])

  // Effect to set up the socket connection when the component mounts
  useEffect(() => {
    // Create a new socket instance
    const _socket = io("http://localhost:8000")

    // Set up an event listener for the "message" event
    // This function if fired when the `message` is recevied from the backend
    _socket.on("message", onMessageReceived)

    // Set the socket instance in the state
    setSocket(_socket)

    // Cleanup function to disconnect the socket when the component unmounts for better performace
    return () => {
      setSocket(undefined)
      _socket.disconnect();
      _socket.off("message", onMessageReceived)
    }
  }, [])

  // Provide the socket context to the wrapped components
  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
```

The SocketContext defines a context named SocketContext that will hold the socket instance, messages, and a function to send messages.

The SocketProvider Component is a React functional component that wraps the entire application. It sets up the WebSocket connection, manages messages, and provides the socket context to its children.

The useEffect hook runs when the component mounts. It creates a new socket instance, sets up event listeners, and cleans up the socket and listeners when the component unmounts.

The useSocket Hook is a custom hook that uses the useContext hook to access the socket context. It throws an error if the context is not available.

Wrap the socket provider around the app to enable access to the socket from any part of the application.

```javascript
# layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SocketProvider } from '@/context/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      // This socketProvier will provide the state variable to all the cihldrens
      <SocketProvider>
        <body className={inter.className}>{children}</body>
      </SocketProvider>
    </html>
  )
}
```

#### Creating a Chat Application Layout and Design Using Tailwind CSS

To create the layout and design for a chat application, we will be using Tailwind CSS. In order to mark the file as a client component, we will utilize socket works as the client component only.

The handleSubmit function is called when the user submits a message. It checks if the message is not empty, clears the input field, and can potentially handle sending the message .

```javascript
# page.tsx

"use client"

import { useState } from "react"
import { useSocket } from "@/context/SocketProvider"

export default function Home() {
  const [message, setMessage] = useState('')
  const { messages, sendMessage } = useSocket()

  const handleSubmit = () => {
    if (message === "") return;
    setMessage('');

    sendMessage(message)
  }

  return (
    <div className="m-10 h-[600px] flex flex-col border-2 rounded-md border-white p-2">
      <div className="h-full overflow-y-auto flex flex-col p-2 overflow-x-hidden gap-1">

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
```

We can import the socket provider that we created earlier to send and display messages. useSocket() is a custom hook that enables us to interact with the state and function create.

Start the development server and open the browser to view the application at <http://localhost:3000>.

```bash
npm run dev
```

Open the application in two different tabs in incognito mode to ensure that it is working properly.

🎉🎉 Hooray! You have successfully created a chat application. This was just an introduction to websockets. In the next blog, we will explore the limitations of websockets for scaling and how to scale the websocket server using redis and kafka.
