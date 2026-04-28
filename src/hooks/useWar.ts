import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useWar = (roomId?: string) => {
  const { data: war, isPending: isLoadingWar } = useQuery({
    queryKey: ["war", roomId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/war/get-by-roomId/${roomId}`,
      );
      return res?.data.data;
    },
    enabled: !!roomId,
  });

  const { data: recentWars, isPending: isLoadingRecentWars } = useQuery({
    queryKey: ["recent-wars"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/war/recent`);
      return res?.data.data;
    },
  });

  return { war, isLoadingWar, recentWars, isLoadingRecentWars };
};

export default useWar;
