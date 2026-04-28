"use client";

import JoinArenaModal from "@/src/components/JoinArenaModal";
import { useUser } from "@/src/context/userContext";
import { useFetchAllUsers } from "@/src/hooks/useFetchAllUsers";
import useSockets from "@/src/hooks/useSockets";
import useWar from "@/src/hooks/useWar";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Separator,
  Skeleton,
  Spinner,
  Surface,
} from "@heroui/react";
import { CheckCheck, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const StartWarPage = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [arenaId, setArenaId] = useState("");
  const [isGeneratedArenaId, setIsGeneratedArenaId] = useState(false);
  const [isOpponentJoinedArena, setIsOpponentJoinedArena] = useState(false);

  const { recentWars, isLoadingRecentWars } = useWar();

  console.log("recentWars", recentWars);

  const router = useRouter();

  const { dbUser: user } = useUser();

  const {
    joinRoom,
    roomNotification,
    ready,
    readyStatus,
    startWar,
    warNotification,
    leaveRoom,
  } = useSockets(user?.id || "");

  useEffect(() => {
    if (warNotification?.action === "start") {
      router.push(`/arena/${roomNotification?.roomId}`);
    }
  }, [warNotification]);

  const { allUsers } = useFetchAllUsers(
    roomNotification?.users?.map((user: any) => user) || [],
  );

  const isHost = roomNotification?.host === user?.id;
  const isOpponent = roomNotification?.host !== user?.id;

  const handleGenerateArenaId = () => {
    if (!user) return;

    const arenaId = uuidv4();
    setArenaId(arenaId);
    setIsGeneratedArenaId(true);
    joinRoom(arenaId);
  };

  const handleJoinArena = (arenaId: string) => {
    if (!user) return;
    joinRoom(arenaId);
    setIsOpponentJoinedArena(true);
  };

  const allUserIds =
    allUsers?.map((user) => {
      return user?.id;
    }) || [];

  const handleStartWar = () => {
    const data = {
      passage: null,
      roomId: roomNotification.roomId,
      userId: user?.id,
      players: allUserIds,
    };
    startWar(data);
  };

  const handleCancelWar = () => {
    if (!user) return;
    setIsGeneratedArenaId(false);
    setIsOpponentJoinedArena(false);
    leaveRoom(arenaId);
  };

  return (
    <div className="flex-1 flex flex-col gap-10 pt-10 pb-10 items-start justify-start max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-4xl font-semibold">Start a War</h1>
        {!isGeneratedArenaId && (
          <p className="text-lg text-muted">
            Create an arena or join one with an arena ID
          </p>
        )}
        {!isGeneratedArenaId && (
          <div className="flex gap-4 mt-5 w-full">
            <Button
              onClick={handleGenerateArenaId}
              variant="primary"
              className="w-full"
              size="lg"
            >
              Create Arena
            </Button>
            {!roomNotification?.users && (
              <JoinArenaModal handleJoinArena={handleJoinArena} />
            )}
          </div>
        )}
      </div>

      {isGeneratedArenaId && (
        <div className="w-full">
          <p className="font-medium">Your Arena ID</p>
          <p className="text-sm text-muted">
            Share with your opponent to join the arena
          </p>
          <Surface
            className="flex items-center gap-2 p-3 rounded-xl mt-2"
            variant="secondary"
          >
            <p className="flex-1">{arenaId}</p>
            <Button
              onPress={() => {
                navigator.clipboard.writeText(arenaId);
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
            >
              {isCopied ? <CheckCheck /> : <Copy />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </Surface>
        </div>
      )}

      {/* for Host */}
      {isGeneratedArenaId && (
        <div className="w-full">
          {isHost &&
            roomNotification?.users?.length > 0 &&
            isGeneratedArenaId && (
              <Surface className="p-4">
                <p className="font-medium text-lg">Players in Arena</p>
                {allUsers?.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mt-5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar color="accent" variant="soft">
                        <Avatar.Image
                          src={u?.photoURL || ""}
                          alt={u?.username}
                        />
                        <Avatar.Fallback>{u?.name[0]}</Avatar.Fallback>
                      </Avatar>

                      <p>
                        {u?.username}{" "}
                        {u?.id === user?.id && (
                          <span className="text-muted">(You)</span>
                        )}
                      </p>
                    </div>
                    {roomNotification?.host === u?.id && (
                      <Chip variant="soft" size="sm" color="warning">
                        Host
                      </Chip>
                    )}
                  </div>
                ))}
                {roomNotification?.users?.length === 1 && (
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        animationType="shimmer"
                        className="size-10 rounded-full"
                      />

                      <div className="flex items-center gap-2">
                        <Spinner size="sm" color="current" />
                        <p className="shimmer-text">
                          Waiting for the opponent to join...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Surface>
            )}

          {/* for Opponent */}
          {isOpponent &&
            roomNotification?.users?.length > 0 &&
            isOpponentJoinedArena && (
              <Surface className="p-4">
                <p className="font-medium text-lg">Players in Arena</p>
                {allUsers?.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mt-5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar color="accent" variant="soft">
                        <Avatar.Image
                          src={u?.photoURL || ""}
                          alt={u?.username}
                        />
                        <Avatar.Fallback>{u?.name[0]}</Avatar.Fallback>
                      </Avatar>

                      <p>
                        {u?.username}{" "}
                        {u?.id === user?.id && (
                          <span className="text-muted">(You)</span>
                        )}
                      </p>
                    </div>
                    {roomNotification?.host === u?.id && (
                      <Chip variant="soft" size="sm" color="warning">
                        Host
                      </Chip>
                    )}
                  </div>
                ))}
              </Surface>
            )}

          {isHost && allUsers && (
            <div className="flex items-center gap-3 justify-end mt-5">
              <Button variant="tertiary" size="lg" onClick={handleCancelWar}>
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={allUsers?.length !== 2 || readyStatus === null}
                size="lg"
                onClick={handleStartWar}
              >
                Start War
              </Button>
            </div>
          )}

          {isOpponent && allUsers && (
            <div className="flex items-center gap-3 justify-end mt-5">
              <Button variant="tertiary" size="lg" onClick={handleCancelWar}>
                Cancel
              </Button>
              <Button
                onClick={() => ready(roomNotification?.roomId)}
                variant="primary"
                size="lg"
              >
                Ready
              </Button>
            </div>
          )}
        </div>
      )}

      {!isGeneratedArenaId && (
        <div className="w-full">
          <p className="uppercase text-sm text-muted mb-2 font-semibold">
            recent wars
          </p>
          <div className="flex flex-col gap-2">
            {recentWars?.map((war: any, index: number) => (
              <Card key={index}>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Avatar variant="soft" color="accent">
                      <Avatar.Image src={war?.players[0]?.user?.photo} />
                      <Avatar.Fallback>
                        {war?.players[0]?.user?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <Card.Title>
                          {war?.players[0]?.user?.username}
                        </Card.Title>
                        <p className="text-sm text-muted">
                          {war?.players[0]?.wpm} wpm
                        </p>
                      </div>
                      <Card.Description>
                        vs {war?.players[1]?.user?.username} &bull;{" "}
                        {war?.startedAt}
                      </Card.Description>
                    </div>
                  </div>
                </Card.Header>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isGeneratedArenaId && (
        <div>
          <p className="uppercase text-sm text-muted mb-2 font-semibold">
            tips
          </p>
          <div className="grid grid-cols-2 gap-10 max-w-4xl mx-auto mt-0">
            <Card>
              <Card.Header>
                <Card.Title>Warm up first</Card.Title>
                <Card.Description>
                  Practice a solo round before jumping into a war to get your
                  fingers loose.
                </Card.Description>
              </Card.Header>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Accuracy wins</Card.Title>
                <Card.Description>
                  Backspacing slows you down more than typing carefully. Aim for
                  95%+ accuracy.
                </Card.Description>
              </Card.Header>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartWarPage;
