import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useLeaderboard = () => {
  const { data: leaderboard, isPending: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get(`/leaderboard/global`);
      return response.data.data;
    },
  });

  const { data: homeStats, isPending: isLoadingHomeStats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const response = await api.get(`/leaderboard/home-stats`);
      return response.data.data;
    },
  });

  return { leaderboard, isLoadingLeaderboard, homeStats, isLoadingHomeStats };
};
