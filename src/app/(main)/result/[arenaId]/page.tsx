"use client";

import { useDbUser } from "@/src/hooks/useDbUser";
import useWar from "@/src/hooks/useWar";
import { Button, Chip, Separator, Spinner, Surface } from "@heroui/react";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { use } from "react";

const getMinutesAndSeconds = (
  winnerFinishedAt: number | string,
  warStartedAt: number | string,
) => {
  const totalMilliseconds = Number(winnerFinishedAt) - Number(warStartedAt);

  const totalSeconds = Math.floor(totalMilliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes,
    seconds,
  };
};

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

const ResultPage = ({ params }: { params: Promise<{ arenaId: string }> }) => {
  const { arenaId } = use(params);
  const router = useRouter();
  const { war, isLoadingWar } = useWar(arenaId);

  const winner = war?.players.reduce((best: any, current: any) => {
    if (Number(current.progress) > Number(best.progress)) {
      return current;
    }

    if (Number(current.progress) < Number(best.progress)) {
      return best;
    }
    if (Number(current.wpm) > Number(best.wpm)) {
      return current;
    }

    if (Number(current.wpm) < Number(best.wpm)) {
      return best;
    }

    if (Number(current.accuracy) > Number(best.accuracy)) {
      return current;
    }

    if (Number(current.accuracy) < Number(best.accuracy)) {
      return best;
    }

    if (Number(current.error) < Number(best.error)) {
      return current;
    }

    if (Number(current.error) > Number(best.error)) {
      return best;
    }

    return Number(current.finishedAt) < Number(best.finishedAt)
      ? current
      : best;
  });
  const { userById, isLoadingUserById } = useDbUser({ userId: winner?.userId });

  const finishedIn = getMinutesAndSeconds(winner?.finishedAt, war?.startedAt);

  if (isLoadingWar || isLoadingUserById) {
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
    <div className="flex-1 flex flex-col pt-10 gap-10 max-w-8xl mx-auto w-full h-full items-center">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex flex-col items-center gap-3"
      >
        <Chip color="success" className="uppercase">
          War Finished
        </Chip>
        <p className="text-4xl font-bold text-center text-accent">
          {userById?.username}{" "}
          <span className="font-normal text-white">wins</span>
        </p>
        <p className="text-center">
          finished in{" "}
          <span className="font-semibold">
            {finishedIn.minutes}m {finishedIn.seconds}s
          </span>
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-2 gap-10 w-5xl mx-auto"
      >
        {war?.players?.map((player: any) => (
          <Surface
            key={player?.id}
            className={`p-5 rounded-3xl space-y-2 ${player?.id === winner?.id && "border border-accent"}`}
            variant="default"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">{player?.user?.username}</p>
              {player?.id === winner?.id && <Trophy color="orange" size={24} />}
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted">wpm</p>
                <p className="text-3xl font-medium">{player?.wpm || 0}</p>
              </div>
            </div>

            <Separator variant="tertiary" className="my-3" />

            <div className="flex justify-between mt-2">
              <p className="text-xl font-medium">
                {player?.accuracy || 0}%{" "}
                <span className="text-sm text-muted">accuracy</span>
              </p>

              <p className="text-xl font-medium">
                {player?.error || 0}{" "}
                <span className="text-sm text-muted">errors</span>
              </p>

              <p className="text-xl font-medium">
                {
                  getMinutesAndSeconds(player?.finishedAt, war?.startedAt)
                    .minutes
                }
                m{" "}
                {
                  getMinutesAndSeconds(player?.finishedAt, war?.startedAt)
                    .seconds
                }
                s <span className="text-sm text-muted">taken</span>
              </p>
            </div>
          </Surface>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="flex gap-4"
      >
        <Button
          onClick={() => router.push("/start-war")}
          variant="primary"
          size="lg"
        >
          New War
        </Button>
        <Button
          onClick={() => router.push("/leaderboard")}
          variant="tertiary"
          size="lg"
        >
          Leaderboard
        </Button>
      </motion.div>
    </div>
  );
};

export default ResultPage;
