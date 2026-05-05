"use client";

import { useDbUser } from "@/src/hooks/useDbUser";
import useWar from "@/src/hooks/useWar";
import { Button, Chip, Separator, Spinner, Surface } from "@heroui/react";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { use } from "react";

const getTimeFromSeconds = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return { minutes: mins, seconds: secs };
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

  const winner = war?.players?.find((player: any) => player?.isWinner);

  const { userById, isLoadingUserById } = useDbUser({ userId: winner?.userId });

  const finishedIn = getTimeFromSeconds(winner?.timeTaken);

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
    <div className="flex-1 flex flex-col pt-10 md:gap-10 gap-5 xl:max-w-8xl mx-auto w-full h-full items-center">
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
        className="grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-5 md:w-5xl w-full mx-auto"
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

            <div className="md:flex justify-between mt-2 hidden">
              <p className="text-xl font-medium">
                {player?.accuracy || 0}%{" "}
                <span className="text-sm text-muted">accuracy</span>
              </p>

              <p className="text-xl font-medium">
                {player?.error || 0}{" "}
                <span className="text-sm text-muted">errors</span>
              </p>

              <p className="text-xl font-medium">
                {getTimeFromSeconds(player?.timeTaken).minutes}m{" "}
                {getTimeFromSeconds(player?.timeTaken).seconds}s{" "}
                <span className="text-sm text-muted">taken</span>
              </p>
            </div>

            <div className="flex justify-between mt-2 md:hidden">
              <div className="flex flex-col items-start">
                <p className="text-xl font-medium">{player?.accuracy || 0}% </p>
                <span className="text-sm text-muted">accuracy</span>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xl font-medium">{player?.error || 0} </p>
                <span className="text-sm text-muted">errors</span>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-xl font-medium">
                  {getTimeFromSeconds(player?.timeTaken).minutes}m{" "}
                  {getTimeFromSeconds(player?.timeTaken).seconds}s{" "}
                </p>
                <span className="text-sm text-muted">taken</span>
              </div>
            </div>
          </Surface>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="flex gap-4 mb-20 md:mb-0"
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
