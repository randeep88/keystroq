"use client";

import TypingArea from "@/src/components/TypingArea";
import { useUser } from "@/src/context/userContext";
import { useFetchAllUsers } from "@/src/hooks/useFetchAllUsers";
import useSockets from "@/src/hooks/useSockets";
import { Button, Chip, ProgressBar, Surface, Tabs, toast } from "@heroui/react";
import { Delete } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const wordCountTabs = [
  {
    label: "15",
    value: 15,
  },
  {
    label: "25",
    value: 25,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "100",
    value: 100,
  },
];

const ArenaPage = ({ params }: { params: Promise<{ arenaId: string }> }) => {
  const { arenaId } = use(params);
  const [seconds, setSeconds] = useState(0);
  const [isTimeStarted, setIsTimeStarted] = useState(false);
  const [currentUserStats, setCurrentUserStats] = useState<any>(null);
  const [opponentStats, setOpponentStats] = useState<any>(null);
  const [winnerId, setWinnerId] = useState(null);
  const [isBackspaceDisabled, setIsBackspaceDisabled] = useState(false);
  const [wordCount, setWordCount] = useState(15);

  const router = useRouter();

  const { dbUser: user } = useUser();

  const {
    warData,
    getWarData,
    joinRoom,
    liveWarData,
    warNotification,
    setPassage,
    passageData,
    setBackspace,
    backspaceData,
  } = useSockets(user?.id);

  useEffect(() => {
    if (!arenaId || !user?.id) return;
    joinRoom(arenaId);
    getWarData(arenaId);
  }, [arenaId, user?.id]);

  useEffect(() => {
    getWarData(arenaId);
  }, [wordCount]);

  const { allUsers } = useFetchAllUsers(
    warData?.players?.map((player: any) => player) || [],
  );

  useEffect(() => {
    if (!liveWarData) return;

    if (liveWarData.userId === user?.id) {
      setCurrentUserStats(liveWarData);
    } else {
      setOpponentStats(liveWarData);
    }
  }, [liveWarData, user?.id]);

  const opponent = allUsers?.find((u: any) => u.id !== user?.id);
  const hostId = warData?.arena?.host;

  const isHost = user?.id === hostId;

  useEffect(() => {
    if (!isTimeStarted) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimeStarted]);

  useEffect(() => {
    if (passageData?.wordCount && !isHost) {
      setWordCount(passageData?.wordCount);
    }
  }, [passageData?.wordCount]);

  useEffect(() => {
    if (liveWarData?.finishedAt) {
      setIsTimeStarted(false);
    }
  }, [liveWarData]);

  useEffect(() => {
    if (warNotification?.action === "finish") {
      setWinnerId(warNotification?.winner);
    }
    setTimeout(() => {
      if (winnerId && arenaId) {
        router.replace(`/result/${arenaId}`);
      }
    }, 2000);
  }, [warNotification, winnerId, arenaId]);

  useEffect(() => {
    if (isHost) return;
    toast(
      !backspaceData?.isBackspaceDisabled
        ? "Backspace enabled"
        : "Backspace disabled",
    );
  }, [backspaceData]);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex-1 flex flex-col gap-10 pt-10 max-w-8xl mx-auto w-full select-none">
      <div className="grid grid-cols-3 gap-10 w-full">
        {user && (
          <Surface
            className={`p-5 rounded-3xl space-y-2  ${
              winnerId
                ? winnerId === user?.id
                  ? "bg-green-700"
                  : "bg-red-700"
                : ""
            }`}
            variant="default"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{user?.username}</p>
              <div>
                {warData?.arena?.host === user?.id && (
                  <Chip
                    className="me-2"
                    variant="soft"
                    color={`${
                      winnerId
                        ? winnerId === user?.id
                          ? "default"
                          : "default"
                        : "warning"
                    }`}
                  >
                    Host
                  </Chip>
                )}
                <Chip
                  variant="soft"
                  color={`${
                    winnerId
                      ? winnerId === user?.id
                        ? "default"
                        : "default"
                      : "accent"
                  }`}
                >
                  You
                </Chip>
              </div>
            </div>

            <ProgressBar
              aria-label="user-progress-1"
              className="w-full"
              value={currentUserStats?.progress}
            >
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>

            <div className="flex justify-between mt-2">
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  wpm
                </p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.wpm || 0}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  accuracy
                </p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.accuracy || 0}%
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  errors
                </p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.error || 0}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  progress
                </p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.progress || 0}%
                </p>
              </div>
            </div>
          </Surface>
        )}

        <div className="flex items-center justify-center w-full">
          <Image
            src={require("../../../../../public/vs.png")}
            alt="arena background"
            height={250}
            width={250}
          />
        </div>

        {opponent && (
          <Surface
            className={`p-5 rounded-3xl space-y-2 ${
              winnerId
                ? winnerId !== user?.id
                  ? "bg-green-700"
                  : "bg-red-700"
                : ""
            }`}
            variant="default"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{opponent?.username}</p>
              <div>
                {warData?.arena?.host !== user?.id && (
                  <Chip
                    className="me-2"
                    variant="soft"
                    color={`${
                      winnerId
                        ? winnerId === user?.id
                          ? "default"
                          : "default"
                        : "warning"
                    }`}
                  >
                    Host
                  </Chip>
                )}
                <Chip
                  variant="soft"
                  color={`${
                    winnerId
                      ? winnerId === user?.id
                        ? "default"
                        : "default"
                      : "danger"
                  }`}
                >
                  Opponent
                </Chip>
              </div>
            </div>

            <ProgressBar
              aria-label="user-progress-2"
              className="w-full"
              value={opponentStats?.progress}
              color="danger"
            >
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>

            <div className="flex justify-between mt-2">
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  wpm
                </p>
                <p className="text-2xl font-medium">
                  {opponentStats?.wpm || 0}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  accuracy
                </p>
                <p className="text-2xl font-medium">
                  {opponentStats?.accuracy || 0}%
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  errors
                </p>
                <p className="text-2xl font-medium">
                  {opponentStats?.error || 0}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    winnerId
                      ? winnerId === user?.id && "text-white"
                      : "text-muted"
                  }`}
                >
                  progress
                </p>
                <p className="text-2xl font-medium">
                  {opponentStats?.progress || 0}%
                </p>
              </div>
            </div>
          </Surface>
        )}
      </div>

      <div className="flex items-center gap-10">
        <div>
          <Tabs
            isDisabled={!isHost || liveWarData?.typed?.length > 0}
            variant="primary"
            className="w-full max-w-md"
            selectedKey={wordCount.toString()}
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label="Options">
                {wordCountTabs.map((tab) => (
                  <Tabs.Tab
                    key={tab.value}
                    id={tab.value.toString()}
                    onClick={() => setWordCount(tab.value)}
                  >
                    {tab.label}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>

        <Button
          isIconOnly
          isDisabled={!isHost || liveWarData?.typed?.length > 0}
          size="lg"
          onClick={() => {
            setIsBackspaceDisabled(!isBackspaceDisabled);
            setBackspace({
              roomId: arenaId,
              isBackspaceDisabled: !isBackspaceDisabled,
            });
            toast(
              backspaceData?.isBackspaceDisabled
                ? "Backspace enabled"
                : "Backspace disabled",
            );
          }}
          variant={`${backspaceData?.isBackspaceDisabled ? "danger-soft" : "secondary"}`}
        >
          <Delete />
        </Button>

        <Surface variant="transparent" className="px-2 py-1 rounded-3xl">
          <p className="text-xl font-bold text-center tracking-wide">
            {mins}:{secs}
          </p>
        </Surface>

        <Chip size="lg" color="danger" variant="soft">
          <div className="size-2 bg-danger rounded-full mr-1" />{" "}
          <span>Live</span>
        </Chip>
      </div>

      {/* Typing Area */}
      <div className="flex-1">
        <TypingArea
          backspaceData={backspaceData}
          isHost={isHost}
          passageData={passageData}
          setPassage={setPassage}
          isBackspaceDisabled={isBackspaceDisabled}
          wordCount={wordCount}
          warData={warData}
          setIsTimeStarted={setIsTimeStarted}
          isTimeStarted={isTimeStarted}
        />
      </div>
    </div>
  );
};

export default ArenaPage;
