"use client";

import { useQuery } from "@tanstack/react-query";
import useApi from "../utils/api";

const useWar = (roomId?: string) => {
  const api = useApi();
  const { data: war, isPending: isLoadingWar } = useQuery({
    queryKey: ["war", roomId],
    queryFn: async () => {
      const res = await api.get(`/war/get-by-roomId/${roomId}`);
      return res?.data.data;
    },
    enabled: !!roomId,
  });

  const { data: recentWars, isPending: isLoadingRecentWars } = useQuery({
    queryKey: ["recent-wars"],
    queryFn: async () => {
      const res = await api.get(`/war/recent`);
      return res?.data.data;
    },
  });

  return { war, isLoadingWar, recentWars, isLoadingRecentWars };
};

export default useWar;
