"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

const useSockets = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);

  const [roomNotification, setRoomNotification] = useState<any>(null);
  const [readyStatus, setReadyStatus] = useState<any>(null);
  const [warNotification, setWarNotification] = useState<any>(null);
  const [warData, setWarData] = useState<any>(null);
  const [liveWarData, setLiveWarData] = useState<any>(null);
  const [passageData, setPassageData] = useState<any>(null);
  const [backspaceData, setBackspaceData] = useState<any>(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("register", userId);
    });

    socketRef.current.on("notify:room", (data: any) => {
      setRoomNotification(data);
    });

    socketRef.current.on("notify:ready", (data: any) => {
      setReadyStatus(data);
    });

    socketRef.current.on("notify:war", (data: any) => {
      setWarNotification(data);
    });

    socketRef.current.on("receive:war-data", (data: any) => {
      setWarData(data);
    });

    socketRef.current.on("receive:live-war-data", (data: any) => {
      setLiveWarData(data);
    });

    socketRef.current.on("passage:set", (data: any) => {
      setPassageData(data);
    });

    socketRef.current.on("backspace:set", (data: any) => {
      setBackspaceData(data);
    });

    return () => {
      socketRef.current?.disconnect();
      console.log("user disconnected");
    };
  }, [userId]);

  const joinRoom = (roomId: string) => {
    socketRef.current?.emit("join-room", { userId, roomId });
  };

  const leaveRoom = (roomId: string) => {
    socketRef.current?.emit("leave-room", { userId, roomId });
  };

  const ready = (roomId: string) => {
    socketRef.current?.emit("ready", { userId, roomId });
  };

  const startWar = (data: any) => {
    socketRef.current?.emit("war:start", data);
  };

  const finishWar = (data: any) => {
    socketRef.current?.emit("war:finish", data);
  };

  const getWarData = (roomId: string) => {
    socketRef.current?.emit("get-war-data", roomId);
  };

  const sendLiveData = (data: any) => {
    socketRef.current?.emit("live-war-data", data);
  };

  const setPassage = (data: any) => {
    socketRef.current?.emit("set-passage", data);
  };

  const setBackspace = (data: any) => {
    socketRef.current?.emit("set-backspace", data);
  };

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    ready,
    startWar,
    finishWar,
    getWarData,
    sendLiveData,
    roomNotification,
    readyStatus,
    warNotification,
    warData,
    liveWarData,
    setPassage,
    setBackspace,
    backspaceData,
    passageData,
  };
};

export default useSockets;
