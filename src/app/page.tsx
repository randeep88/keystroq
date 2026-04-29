"use client";

import { Button, Card, Chip, Separator, Spinner } from "@heroui/react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { motion } from "motion/react";
import { useUser } from "../context/userContext";
import LoginModal from "../components/LoginModal";
import { useState } from "react";

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

const HomePage = () => {
  const { homeStats, isLoadingHomeStats } = useLeaderboard();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // if (isLoadingHomeStats) {
  //   return (
  //     <div className="flex-1 flex flex-col pt-10 gap-10 w-5xl mx-auto h-[calc(100vh-6rem)] items-center justify-center">
  //       <p className="flex items-center gap-3">
  //         <Spinner color="current" size="sm" />
  //         Loading...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col gap-5 items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Chip size="lg">Real-time 1v1 Typing Duels</Chip>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="xl:text-7xl font-semibold"
          >
            type fast, win wars.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Challenge anyone to a live typing duel. Share a link, race to the
            finish, prove who's faster.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex items-center gap-5"
        >
          <Button
            size="lg"
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginOpen(true);
                return;
              }

              router.push("/start-war");
            }}
          >
            Start a War
          </Button>

          <Button
            variant="tertiary"
            size="lg"
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginOpen(true);
                return;
              }

              router.push("/start-war");
            }}
          >
            Join using Arena ID
          </Button>
        </motion.div>

        <Separator variant="tertiary" className="my-6" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="grid grid-cols-3 items-center gap-20"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">{homeStats?.totalWars || 0}</h1>
            <p className="text-muted-foreground">wars fought</p>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              {homeStats?.totalPlayers || 0}
            </h1>
            <p className="text-muted-foreground">players</p>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              {homeStats?.avgTopWpm || 0} WPM
            </h1>
            <p className="text-muted-foreground">avg top speed</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="grid grid-cols-2 gap-10 max-w-4xl mx-auto mt-5"
        >
          <Card>
            <Card.Header>
              <Card.Title>1v1 Real-time Duel</Card.Title>
              <Card.Description>
                Live progress sync — watch your opponent type in real time.
              </Card.Description>
            </Card.Header>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Leaderboard</Card.Title>
              <Card.Description>
                Track your WPM, accuracy and rank against everyone.
              </Card.Description>
            </Card.Header>
          </Card>
        </motion.div>
      </div>

      <LoginModal isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
    </div>
  );
};

export default HomePage;
