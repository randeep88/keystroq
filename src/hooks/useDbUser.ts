import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useApi from "../utils/api";

export const useDbUser = ({
  userId,
  email,
}: {
  userId?: string;
  email?: string;
}) => {
  const queryClient = useQueryClient();
  const api = useApi();

  const { data: userById, isPending: isLoadingUserById } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get(`/user/get-by-id/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  const { data: userByEmail, isPending: isLoadingUserByEmail } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await api.get(`/user/get-by-email/${email}`);
      return res.data.data;
    },
    enabled: !!email,
  });

  const { mutate: updatePhoto, isPending: isUpdating } = useMutation({
    mutationFn: async (data: { userId: string; formData: FormData }) => {
      const res = await api.put(
        `/user/update-photo/${data.userId}`,
        data.formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return res?.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Photo updated successfully");
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ["user", userId] });
        }
        if (email) {
          queryClient.invalidateQueries({ queryKey: ["user", email] });
        }
      }
    },
    onError: (error) => {
      toast.warning("Failed to update photo. Please try again.");
    },
  });

  return {
    userById,
    isLoadingUserById,
    userByEmail,
    isLoadingUserByEmail,
    updatePhoto,
    isUpdating,
  };
};
