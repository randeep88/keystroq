"use client";

import TypingArea from "@/src/components/TypingArea";
import { useUser } from "@/src/context/userContext";
import { useFetchAllUsers } from "@/src/hooks/useFetchAllUsers";
import useSockets from "@/src/hooks/useSockets";
import { Chip, ProgressBar, Surface } from "@heroui/react";
import { use, useEffect, useState } from "react";

const ArenaPage = ({ params }: { params: Promise<{ arenaId: string }> }) => {
  const { arenaId } = use(params);
  const [seconds, setSeconds] = useState(0);
  const [isTimeStarted, setIsTimeStarted] = useState(false);

  console.log(seconds);

  const { dbUser: user } = useUser();

  const { warData, getWarData, joinRoom, liveWarData } = useSockets(user?.id);

  console.log("liveWarData", liveWarData);

  useEffect(() => {
    if (!arenaId || !user?.id) return;
    joinRoom(arenaId);
    getWarData(arenaId);
  }, [arenaId, user?.id]);

  const { allUsers } = useFetchAllUsers(
    warData?.players?.map((player: any) => player) || [],
  );

  const currentUserStats =
    liveWarData?.userId === user?.id ? liveWarData : null;

  const opponentStats = liveWarData?.userId !== user?.id ? liveWarData : null;

  const opponent = allUsers?.find((u: any) => u.id !== user?.id);

  useEffect(() => {
    const c = () => {
      if (!isTimeStarted) return;
      setTimeout(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    };
    c();
    return () => clearTimeout(c as any);
  }, [seconds]);

  // const winner = () => {
  //   if (!currentUserStats || !opponentStats) return null;
  //   if (currentUserStats.progress > opponentStats.progress) {
  //     return user;
  //   }
  //   return opponent;
  // };

  return (
    <div className="flex-1 flex flex-col gap-10 pt-10 max-w-8xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-10 w-full">
        {user && (
          <Surface className="p-5 rounded-3xl space-y-2" variant="default">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{user?.username}</p>
              <Chip variant="soft" color="accent">
                You
              </Chip>
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
                <p className="text-sm text-muted">wpm</p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.wpm || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">accuracy</p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.accuracy || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">errors</p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.error || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">progress</p>
                <p className="text-2xl font-medium">
                  {currentUserStats?.progress || 0}%
                </p>
              </div>
            </div>
          </Surface>
        )}

        <div className="flex flex-col items-center gap-2 w-full justify-center">
          <Chip size="lg" color="danger" variant="soft">
            <div className="size-2 bg-danger rounded-full mr-1" />{" "}
            <span>Live</span>
          </Chip>
          <Surface variant="secondary" className="px-4 py-2 rounded-3xl">
            <p className="text-3xl font-bold text-center tracking-wide">
              {seconds}
            </p>
          </Surface>
        </div>
        {opponent && (
          <Surface className="p-5 rounded-3xl space-y-2" variant="default">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{opponent?.username}</p>
              <Chip variant="soft" color="danger">
                Opponent
              </Chip>
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
                <p className="text-sm text-muted">wpm</p>
                <p className="text-2xl font-medium">
                  {opponentStats?.wpm || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">accuracy</p>
                <p className="text-2xl font-medium">
                  {opponentStats?.accuracy || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">errors</p>
                <p className="text-2xl font-medium">
                  {opponentStats?.error || 0}
                </p>
              </div> 
              <div>
                <p className="text-sm text-muted">progress</p>
                <p className="text-2xl font-medium">
                  {opponentStats?.progress || 0}%
                </p>
              </div>
            </div>
          </Surface>
        )}
      </div>

      {/* Typing Area */}
      <div className="flex-1">
        <TypingArea
          warData={warData}
          setIsTimeStarted={setIsTimeStarted}
          isTimeStarted={isTimeStarted}
        />
      </div>
    </div>
  );
};

export default ArenaPage;
