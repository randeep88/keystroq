"use client";

import EditProfile from "@/src/components/EditProfile";
import { useUser } from "@/src/context/userContext";
import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import useWar from "@/src/hooks/useWar";
import { Avatar, Button, Card, Chip, Spinner, Surface } from "@heroui/react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
};

const ProfilePage = () => {
  const { dbUser: user } = useUser();
  const { recentWars, isLoadingRecentWars } = useWar();
  const { leaderboard, isLoadingLeaderboard } = useLeaderboard();
  const router = useRouter();

  const myRecentWars = recentWars?.filter((war: any) =>
    war?.players?.some((player: any) => player?.user?.id === user?.id),
  );

  const isMe = leaderboard?.find((l: any) => l?.player?.id === user?.id);

  if (isLoadingRecentWars || isLoadingLeaderboard) {
    return (
      <div className="flex-1 flex flex-col pt-10 gap-10 w-5xl mx-auto h-[calc(100vh-6rem)] items-center justify-center">
        <p className="flex items-center gap-3">
          <Spinner color="current" size="sm" />
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pt-10 gap-10 w-5xl mx-auto h-full items-start">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex items-center gap-5 w-full"
      >
        <EditProfile user={user} />
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="font-semibold text-xl">{user?.username}</p>
            <p className="text-muted mt-1">
              member since{" "}
              {user?.createdAt ? format(user?.createdAt, "MMM yyyy") : "N/A"}
            </p>
          </div>
        </div>
        <Chip variant="secondary" color="success" size="lg">
          Rank #{isMe?.rank}
        </Chip>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-4 gap-16 justify-between items-center w-full"
      >
        <Card>
          <Card.Header>
            <p className="text-muted text-sm uppercase mb-1">Best WPM</p>
            <p className="text-2xl font-medium">{isMe?.bestWpm}</p>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <p className="text-muted text-sm uppercase mb-1">avg WPM</p>
            <p className="text-2xl font-medium">{isMe?.avgWpm}</p>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <p className="text-muted text-sm uppercase mb-1">wars</p>
            <p className="text-2xl font-medium">{isMe?.wars}</p>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <p className="text-muted text-sm uppercase">wins</p>
            <p className="text-2xl font-medium">{isMe?.wins}</p>
          </Card.Header>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="w-full"
      >
        <p className="uppercase text-sm text-muted mb-2 font-semibold">
          your recent wars
        </p>
        {myRecentWars?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {myRecentWars?.map((war: any, index: number) => (
              <Card key={index}>
                <Card.Header>
                  <div className="flex items-center gap-5">
                    {war?.players?.some(
                      (p: any) => p?.user?.id === user?.id && p?.isWinner,
                    ) ? (
                      <Chip variant="soft" color="success">
                        Won
                      </Chip>
                    ) : (
                      <Chip variant="soft" color="danger">
                        Lost
                      </Chip>
                    )}

                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center justify-between">
                        <Card.Title className="text-lg text-accent">
                          <div className="flex items-center gap-2">
                            <span className="text-muted">vs</span>{" "}
                            <Avatar size="sm" className="size-6">
                              <Avatar.Image
                                src={
                                  war?.players.find(
                                    (p: any) => p?.user?.id !== user?.id,
                                  )?.user?.photo
                                }
                              />
                              <Avatar.Fallback>
                                {war?.players
                                  .find((p: any) => p?.user?.id !== user?.id)
                                  ?.user?.username?.charAt(0)
                                  ?.toUpperCase()}
                              </Avatar.Fallback>
                            </Avatar>
                            {war?.players.some(
                              (p: any) => p?.user?.id !== user?.id,
                            )
                              ? war?.players.find(
                                  (p: any) => p?.user?.id !== user?.id,
                                )?.user?.username
                              : "Unknown"}
                          </div>
                        </Card.Title>
                      </div>
                      <div className="flex text-muted items-center gap-2">
                        <p>
                          {
                            war?.players.find(
                              (p: any) => p?.user?.id !== user?.id,
                            ).wpm
                          }{" "}
                          wpm
                        </p>
                        &bull;
                        <p>
                          {war?.startedAt
                            ? formatDistanceToNow(
                                new Date(Number(war.startedAt)),
                                {
                                  addSuffix: true,
                                },
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Header>
              </Card>
            ))}
          </div>
        ) : (
          <Surface className="flex flex-col gap-5 items-center justify-center p-10">
            <p className="text-muted text-lg font-semibold">No Recent Wars</p>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => router.push("/start-war")}>
                Start a War
              </Button>
              <span className="text-muted">or</span>
              <Button
                variant="tertiary"
                onClick={() => router.push("/start-war")}
                size="sm"
              >
                Join Existing
              </Button>
            </div>
          </Surface>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
