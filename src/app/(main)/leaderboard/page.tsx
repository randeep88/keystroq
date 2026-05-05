"use client";

import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import { Avatar, Spinner } from "@heroui/react";
import { Table } from "@heroui/react";
import { motion } from "motion/react";

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

const LeaderboardPage = () => {
  const { leaderboard, isLoadingLeaderboard } = useLeaderboard();

  const filteredLeaderboard = leaderboard?.filter((l: any) => l.bestWpm > 0);

  if (isLoadingLeaderboard) {
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
    <div className="flex-1 flex flex-col pt-10 gap-10 xl:w-5xl w-full mx-auto h-full items-start">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <p className="md:text-4xl text-3xl font-bold">Leaderboard</p>
        <p className="text-muted text-lg mt-1.5">
          Top players ranked by best WPM
        </p>
      </motion.div>

      <motion.div
        className="w-full"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Team members" className="w-full">
              <Table.Header>
                <Table.Column isRowHeader>RANK</Table.Column>
                <Table.Column>PLAYER</Table.Column>
                <Table.Column>BEST WPM</Table.Column>
                <Table.Column>AVG WPM</Table.Column>
                <Table.Column>WARS</Table.Column>
                <Table.Column>WINS</Table.Column>
              </Table.Header>
              <Table.Body>
                {filteredLeaderboard?.length > 0 ? (
                  filteredLeaderboard.map((l: any, i: number) => (
                    <Table.Row key={i}>
                      <Table.Cell>#{l.rank}</Table.Cell>
                      <Table.Cell className="flex items-center gap-3">
                        <Avatar size="sm" color="accent" variant="soft">
                          <Avatar.Image
                            alt={l.player.fullName}
                            src={l.player.imageUrl}
                          />
                          <Avatar.Fallback>
                            {l.player.fullName?.charAt(0).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        {l.player.username}
                      </Table.Cell>
                      <Table.Cell>{l.bestWpm}</Table.Cell>
                      <Table.Cell>{l.avgWpm}</Table.Cell>
                      <Table.Cell>{l.wars}</Table.Cell>
                      <Table.Cell>{l.wins}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
                      <div className="w-full flex items-center justify-center py-10">
                        <p className="text-muted text-lg font-semibold">
                          No players found
                        </p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
