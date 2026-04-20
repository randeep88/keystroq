import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDbUser = ({
  userId,
  email,
}: {
  userId?: string;
  email?: string;
}) => {
  const { data: userById, isPending: isLoadingUserById } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/user/get-by-id/${userId}`,
      );
      return res.data.data;
    },
    enabled: !!userId,
  });
  const { data: userByEmail, isPending: isLoadingUserByEmail } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/user/get-by-email/${email}`,
      );
      return res.data.data;
    },
    enabled: !!email,
  });
  return { userById, isLoadingUserById, userByEmail, isLoadingUserByEmail };
};
