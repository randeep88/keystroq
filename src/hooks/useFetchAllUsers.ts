import { useQuery } from "@tanstack/react-query";
import useApi from "../utils/api";

export const useFetchAllUsers = (userIds: string[]) => {

  const api = useApi();
  const { data: allUsers, isPending: isLoadingAllUsers } = useQuery({
    queryKey: ["users", userIds],
    queryFn: async () => {
      const promises = userIds.map((id) => api.get(`/user/get-by-id/${id}`));
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data.data);
    },
    enabled: userIds.length > 0,
  });

  return { allUsers, isLoadingAllUsers };
};
