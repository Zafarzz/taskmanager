import { useMutation, useQueryClient } from "react-query";
import { notificationApi } from "../../api/notifications";

export const useChangeNotificationAll = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, value }: { id: string | undefined; value: boolean }) =>
      notificationApi.changeNotification(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "groupProjectData" });
    },
  });

  return { ...mutation };
};

export const useChangeNotificationStatusAll = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, value }: { id: string | undefined; value: boolean }) =>
      notificationApi.changeNotificationStatus(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "groupProjectData" });
    },
  });

  return { ...mutation };
};
