"use client";

import { useEffect, useRef, useState } from "react";
import useSockets from "../hooks/useSockets";
import { useUser } from "../context/userContext";

const TypingArea = ({
  warData,
  setIsTimeStarted,
  isTimeStarted,
}: {
  warData: any;
  setIsTimeStarted: any;
  isTimeStarted: boolean;
}) => {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log("error", error);

  const { dbUser: user } = useUser();
  const { sendLiveData } = useSockets(user?.id);

  const passage = warData?.arena?.passage || "";
  const roomId = warData?.arena?.roomId || "";

  useEffect(() => {
    if (sendLiveData && user?.id && roomId) {
      sendLiveData({
        userId: user?.id,
        typed,
        wpm,
        error,
        accuracy,
        startTime,
        roomId,
        progress: Math.round((typed.length / passage.length) * 100),
      });
    }
  }, [typed, wpm, accuracy, startTime, user?.id, roomId]);

  // focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // pehla keypress pe timer start karo
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      if (!isTimeStarted) {
        setIsTimeStarted(true);
      }
    }

    setTyped(value);
    calculate(value);
  };

  const calculate = (value: string) => {
    if (!startTime) return;

    // WPM
    const minutes = (Date.now() - startTime) / 1000 / 60;
    const words = value.length / 5;
    setWpm(Math.round(words / minutes));

    // Accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === passage[i]) correct++;
    }
    setAccuracy(Math.round((correct / value.length) * 100));

    // Errors
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== passage[i]) errors++;
    }
    setError(errors);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // tab press se focus na jaye
    if (e.key === "Tab") e.preventDefault();
    if (e.key === "Backspace") e.preventDefault();
  };

  return (
    <div onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        className="opacity-0 absolute"
        onKeyDown={handleKeyDown}
        maxLength={passage.length}
      />

      {/* render passage */}
      <div className="text-2xl font-mono cursor-text">
        {passage.split("").map((char: any, i: number) => {
          let color = "text-muted";

          if (i < typed.length) {
            color = typed[i] === char ? "text-green-500" : "text-red-500";
          }

          return (
            <span key={i} className={`relative ${color}`}>
              {/* cursor */}
              {i === typed.length && (
                <span className="absolute -left-0.5 top-0 h-full w-0.5 bg-purple-500 animate-pulse" />
              )}
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingArea;
