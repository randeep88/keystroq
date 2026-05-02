import { useQuery } from "@tanstack/react-query";
import useApi from "../utils/api";
export const useLeaderboard = () => {
  const api = useApi();
  const {
    data: leaderboard,
    isPending: isLoadingLeaderboard,
    error: leaderboardError,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get(`/leaderboard/global`);
      return response.data.data;
    },
  });

  const {
    data: homeStats,
    isPending: isLoadingHomeStats,
    error: homeStatsError,
  } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const response = await api.get(`/leaderboard/home-stats`);
      return response.data.data;
    },
  });

  return {
    leaderboard,
    isLoadingLeaderboard,
    leaderboardError,
    homeStats,
    isLoadingHomeStats,
    homeStatsError,
  };
};
