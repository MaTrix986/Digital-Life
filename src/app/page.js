"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import InputBox from "@/app/ui/inputBox"
import MsgList from "@/app/ui/msgList";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [txt, setTxt] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on('chat message', (msg) =>{
      setTxt(msg.msg);
    })

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);


  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>
      <MsgList msg={ txt } />
      <InputBox placeholder="say something..."/>
    </div>
  );
}