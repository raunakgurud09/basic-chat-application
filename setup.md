# Node.js Next.js Socket.IO App

This repository contains a basic chat/video application built with Node.js, Next.js, and Socket.IO, WebRTC. The application demonstrates the integration of these technologies to create a real-time web application.
This is demo app for the blog series [Websockets unlocked mastering the art of realtime](https://raunakgurud.hashnode.dev/websockets-unlocked-mastering-the-art-of-real-time-communication)

## Prerequisites

Make sure you have the following installed:

- Node.js (18.17.0 or higher)
- npm or yarn

## Getting Started

Follow these steps to get the application up and running on your local machine:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/raunakgurud09/basic-chat-application.git
    cd repo-name
    ```

2. **Install client dependencies and start client server:**

    ```bash
    cd client
    yarn install

    yarn dev
    ```

3. **Install server dependencies and start the development server:**

    ```bash
    cd server
    yarn dev

    yarn dev
    ```

4. **Open your browser:**

    Visit `http://localhost:3000` to see the application running.

## Usage

- **Join Chat:** Users can enter a username and join the chat room.
- **Send Messages:** Once joined, users can send messages that are instantly displayed for all participants.
- **Real-time Updates:** Messages are transmitted in real-time using Socket.IO, ensuring immediate communication between users.

## Features

List the key features of the application:

- **Real-time Chat:** Utilizes Socket.IO for instant message updates across all connected clients.
- **Simple UI:** Provides a straightforward user interface for easy interaction.
- **Username Support:** Allows users to set their usernames before entering the chat room.
- **Responsive Design:** Basic responsive design ensures usability across devices.

## Folder Structure

├── client
│   ├── app
│   ├── context
└── server
    ├── src

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a pull request
