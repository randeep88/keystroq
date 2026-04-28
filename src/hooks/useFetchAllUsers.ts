import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchAllUsers = (userIds: string[]) => {
  const { data: allUsers, isPending: isLoadingAllUsers } = useQuery({
    queryKey: ["users", userIds],
    queryFn: async () => {
      const promises = userIds.map((id) =>
        axios.get(`http://localhost:5000/api/user/get-by-id/${id}`)
      );
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data.data);
    },
    enabled: userIds.length > 0,
  });

  return { allUsers, isLoadingAllUsers };
};