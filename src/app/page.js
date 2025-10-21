"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import InputBox from "@/app/ui/inputBox"
import MsgList from "@/app/ui/msgList";
import Info from "@/app/ui/info"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [txt, setTxt] = useState("");
  const [systemInfo, setSystemInfo] = useState({});

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
    });


    socket.on('info', (info) => {
      setSystemInfo(info);
    });

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
      <Info systemInfo={ systemInfo } />
      <InputBox placeholder="say something..."/>
    </div>
  );
}