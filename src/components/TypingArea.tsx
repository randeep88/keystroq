"use client";

import { useEffect, useRef, useState } from "react";
import useSockets from "../hooks/useSockets";
import { useUserContext } from "../context/userContext";
import { Surface } from "@heroui/react";

const words = [
  "time",
  "day",
  "night",
  "morning",
  "evening",
  "world",
  "people",
  "family",
  "friend",
  "home",
  "house",
  "room",
  "door",
  "window",
  "table",
  "chair",
  "water",
  "food",
  "bread",
  "milk",
  "tea",
  "coffee",
  "sugar",
  "salt",
  "rice",
  "fruit",
  "apple",
  "banana",
  "mango",
  "orange",
  "flower",
  "tree",
  "plant",
  "garden",
  "grass",
  "river",
  "mountain",
  "cloud",
  "rain",
  "storm",
  "summer",
  "winter",
  "spring",
  "school",
  "college",
  "teacher",
  "student",
  "book",
  "paper",
  "pen",
  "pencil",
  "lesson",
  "class",
  "exam",
  "answer",
  "question",
  "number",
  "money",
  "market",
  "shop",
  "store",
  "road",
  "street",
  "car",
  "bus",
  "train",
  "bike",
  "cycle",
  "travel",
  "ticket",
  "station",
  "office",
  "worker",
  "doctor",
  "nurse",
  "hospital",
  "health",
  "happy",
  "smile",
  "laugh",
  "cry",
  "dream",
  "hope",
  "love",
  "care",
  "help",
  "support",
  "truth",
  "peace",
  "light",
  "sound",
  "music",
  "dance",
  "movie",
  "picture",
  "camera",
  "phone",
  "mobile",
  "laptop",
  "screen",
  "battery",
  "clock",
  "watch",
  "shirt",
  "shoes",
  "dress",
  "bag",
  "wallet",
  "mother",
  "father",
  "brother",
  "sister",
  "child",
  "baby",
  "uncle",
  "aunt",
  "grand",
  "village",
  "city",
  "country",
  "nation",
  "future",
  "past",
  "present",
  "dream",
  "goal",
  "work",
  "job",
  "career",
  "success",
  "failure",
  "effort",
  "practice",
  "habit",
  "choice",
  "change",
  "chance",
  "moment",
  "memory",
  "story",
  "voice",
  "heart",
  "mind",
  "power",
  "energy",
  "strong",
  "simple",
  "better",
  "honest",
  "clean",
  "fresh",
  "sweet",
  "cold",
  "warm",
  "fast",
  "slow",
  "early",
  "late",
  "young",
  "older",
  "small",
  "large",
  "short",
  "tall",
  "black",
  "white",
  "green",
  "yellow",
  "orange",
  "purple",
  "silver",
  "gold",
  "today",
  "tomorrow",
  "yesterday",
];

const TypingArea = ({
  setPassage,
  timeTaken,
  backspaceData,
  isBackspaceDisabled,
  passageData,
  isHost,
  wordCount,
  warData,
  setIsTimeStarted,
  isTimeStarted,
}: {
  backspaceData: any;
  timeTaken: number;
  isBackspaceDisabled: boolean;
  passageData: any;
  isHost: boolean;
  wordCount: number;
  warData: any;
  setIsTimeStarted: any;
  isTimeStarted: boolean;
  setPassage: (data: any) => void;
}) => {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [passage, setPassageState] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [finishedAt, setFinishedAt] = useState<any>(null);

  const caretRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const currentChar = charRefs.current[typed.length];
    const container = caretRef.current?.parentElement;
    if (!currentChar || !container || !caretRef.current) return;

    const charRect = currentChar.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    caretRef.current.style.left = `${charRect.left - containerRect.left}px`;
    caretRef.current.style.top = `${charRect.top - containerRect.top}px`;
    caretRef.current.style.height = `${charRect.height}px`;
  }, [typed.length]);

  const warDataPassage = warData?.arena?.passage || "";
  const roomId = warData?.arena?.roomId || passageData?.roomId;

  const generatePassage = (count: number) => {
    let result = [];

    for (let i = 0; i < count; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      result.push(randomWord.toLowerCase());
    }

    return result.join(" ");
  };

  useEffect(() => {
    if (!roomId) return;

    if (isHost) {
      const newPassage = generatePassage(wordCount);
      setPassage({
        roomId,
        passage: newPassage,
        isBackspaceDisabled,
        wordCount,
      });
      setPassageState(newPassage);
    }
    setTyped("");
    setStartTime(null);
    setWpm(0);
    setError(0);
    setAccuracy(100);
    setFinishedAt(null);
  }, [wordCount, roomId]);

  useEffect(() => {
    if (isHost) return;
    if (!passageData?.passage) return;

    setPassageState(passageData?.passage);
  }, [passageData?.passage, passageData?.isBackspaceDisabled]);

  const { dbUser: user } = useUserContext();
  const { sendLiveData, finishWar } = useSockets(user?.id);

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
        finishedAt,
        progress: Math.round((typed.length / passage.length) * 100),
      });
    }
  }, [typed, wpm, accuracy, startTime, user?.id, roomId, finishedAt]);

  useEffect(() => {
    if (typed.length === passage?.length && passage?.length > 0) {
      setFinishedAt(Date.now());
    }
  }, [typed, passage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      if (!isTimeStarted) {
        setIsTimeStarted(true);
      }
    }

    if (value.length === passage.length) {
      finishWar({
        userId: user?.id,
        roomId,
        wpm,
        accuracy,
        error,
        progress: 100,
        timeTaken,
        finishedAt: Date.now(),
      });
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
    if (e.key === "Tab") e.preventDefault();

    if (backspaceData?.isBackspaceDisabled && e.key === "Backspace")
      e.preventDefault();
  };

  if (!warDataPassage) {
    return (
      <div className="text-center py-10 text-muted">
        Choose desired word count for passage
      </div>
    );
  }

  return (
    <Surface
      variant="secondary"
      onClick={() => inputRef.current?.focus()}
      className="p-5 rounded-3xl"
    >
      <input
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        className="opacity-0 absolute"
        onKeyDown={handleKeyDown}
        maxLength={passage?.length}
      />

      {/* render passage */}
      <div className="text-2xl font-mono cursor-text relative">
        {/* Single caret */}
        <span
          ref={caretRef}
          className="absolute w-0.5 bg-yellow-500 transition-all duration-100 ease-out pointer-events-none"
          style={{ position: "absolute" }}
        />

        {passage?.split("").map((char: any, i: number) => {
          let color = "text-muted";
          if (i < typed.length) {
            color = typed[i] === char ? "text-green-500" : "text-red-500";
          }

          return (
            <span
              key={i}
              ref={(el: any) => (charRefs.current[i] = el)}
              className={`relative ${color}`}
            >
              {char}
            </span>
          );
        })}
      </div>
    </Surface>
  );
};

export default TypingArea;
