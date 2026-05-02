import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import useApi from "../utils/api";

const useSyncUser = () => {
  const api = useApi();
  const { mutate: syncUser, isPending: isSyncing } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/user/sync`, data);
      return res?.data;
    },
    onError: (error: any) => {
      toast.warning("Failed to sync user.");
    },
  });

  return { syncUser, isSyncing };
};

export default useSyncUser;
