import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLeaderboard = () => {
  const { data: leaderboard, isPending: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/api/leaderboard/global`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
  });

  const { data: homeStats, isPending: isLoadingHomeStats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/api/leaderboard/home-stats`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    },
  });

  return { leaderboard, isLoadingLeaderboard, homeStats, isLoadingHomeStats };
};
