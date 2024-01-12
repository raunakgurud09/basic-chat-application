"use client"

import { useSocket } from '@/context/SocketProvider'
import RTC from '@/service/peer'
import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

const Id = ({ params }: { params: { slug: string } }) => {

  const { socket } = useSocket()

  const [remoteSocketId, setRemoteSocketId] = useState<string>('')

  const [myStream, setMyStream] = useState<MediaStream>()
  const [remoteStream, setRemoteStream] = useState<MediaStream>()

  const handleUserJoined = useCallback(({ email, id }: { email: string, id: string }) => {
    console.log(`user joined - email: ${email} socketId:$id`)
    setRemoteSocketId(id)
  }, [])


  const handleCallUser = useCallback(async (data: any) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    // create offer
    const offer = await RTC.getOffer()
    // send offer
    socket.emit("user:call", { to: remoteSocketId, offer })

    setMyStream(stream)
  }, [remoteSocketId, socket])


  const handleIncomingCall = useCallback(
    async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
      setRemoteSocketId(from)

      // setMyStream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      setMyStream(stream)

      // send ans
      const ans = await RTC.getAnswer(offer)
      // emit call accepted
      socket.emit("call:accepted", { to: from, ans })
    },
    [socket],
  )

  const sendStreams = useCallback(() => {
    for (const track of myStream!.getTracks()) {
      // @ts-ignore
      RTC.peer.addTrack(track, myStream)

    }
  }, [myStream])

  const handleCallAccepted = useCallback(({ to, ans }: { to: string, ans: any }) => {

    RTC.setLocalDescription(ans);
    console.log("Call Accepted!");
    sendStreams();

  }, [sendStreams])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await RTC.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);


  useEffect(() => {
    RTC.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      RTC.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);


  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }: any) => {
      const ans = await RTC.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
    await RTC.setLocalDescription(ans);
  }, []);


  useEffect(() => {
    RTC.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);


  useEffect(() => {
    // if (!socket) return;

    socket.on("user:joined", handleUserJoined)
    socket.on("incoming:call", handleIncomingCall)
    socket.on("call:accepted", handleCallAccepted)

    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined)
      socket.off("incoming:call", handleIncomingCall)
      socket.off("call:accepted", handleCallAccepted)

      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    }

  },
    [
      socket,
      handleUserJoined,
      handleIncomingCall,
      handleCallAccepted,
      handleNegoNeedIncoming,
      handleNegoNeedFinal
    ]
  )



  return (
    <div className='flex h-96 flex-col items-center justify-center'>
      <div>{JSON.stringify(params, null, 4)}</div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>

  )
}

export default Id