"use client";

import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import { Avatar, Surface } from "@heroui/react";
import { Table } from "@heroui/react";

const LeaderboardPage = () => {
  const { leaderboard, isLoadingLeaderboard } = useLeaderboard();
  console.log("leaderboard", leaderboard);

  if (isLoadingLeaderboard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col pt-10 gap-10 w-5xl mx-auto h-full items-start">
      <div>
        <p className="text-4xl font-bold">Leaderboard</p>
        <p className="text-muted text-lg mt-1.5">
          Top players ranked by best WPM
        </p>
      </div>

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
              {leaderboard?.map((l: any, i: number) => (
                <Table.Row key={i}>
                  <Table.Cell>#{l.rank}</Table.Cell>
                  <Table.Cell className="flex items-center gap-3">
                    <Avatar size="sm" color="accent" variant="soft">
                      <Avatar.Image alt={l.player.name} src={l.player.photo} />
                      <Avatar.Fallback delayMs={600}>
                        {l.player.name?.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>
                    {l.player.username}
                  </Table.Cell>
                  <Table.Cell>{l.bestWpm}</Table.Cell>
                  <Table.Cell>{l.avgWpm}</Table.Cell>
                  <Table.Cell>{l.wars}</Table.Cell>
                  <Table.Cell>{l.wins}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
};

export default LeaderboardPage;
