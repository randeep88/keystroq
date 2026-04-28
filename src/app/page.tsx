"use client";

import { Button, Card, Chip, Separator } from "@heroui/react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeaderboard } from "../hooks/useLeaderboard";

const HomePage = () => {
  const { homeStats } = useLeaderboard();
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col gap-5 items-center justify-center">
        <div className="text-center space-y-4">
          <Chip size="lg">Real-time 1v1 Typing Duels</Chip>
          <h1 className="xl:text-7xl font-semibold">type fast, win wars.</h1>
          <p>
            Challenge anyone to a live typing duel. Share a link, race to the
            finish, prove who's faster.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Button size="lg" onClick={() => router.push("/start-war")}>
            Start a War
          </Button>
          <Button
            variant="tertiary"
            size="lg"
            onClick={() => router.push("/start-war")}
          >
            Join using Arena ID
          </Button>
        </div>

        <Separator variant="tertiary" className="my-6" />

        <div className="grid grid-cols-3 items-center gap-20">
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
        </div>

        <div className="grid grid-cols-3 gap-10 max-w-4xl mx-auto mt-5">
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
              <Card.Title>Spectate Mode</Card.Title>
              <Card.Description>
                Watch any live war as a spectator — account needed.
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
