import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../../api/tasks";
import { toast } from "react-toastify";
import axiosClient from "../../../common/axiosClient";
import { t } from "i18next";

export const useCreateTask = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: (data) => {
      navigate("/tasks/" + data.id, {replace: true});
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });
};

export const useDeleteTask = (project_id?: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      toast.success("Success", {
        position: "top-right",
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: "tasksDate" });
      queryClient.invalidateQueries({ queryKey: "archiveTasks" });
      if (project_id) {
        navigate(`/projects/${project_id}`, { replace: true });
      }
    },
    onError: () => {
      toast.error("Error deleting the item.", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });
};

export const useArchiveTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ isArchived, taskId }: { isArchived: boolean; taskId: number }) => {
      return axiosClient.put(`/task/${taskId}/archive`, {
        archive: isArchived,
      });
    },
    {
      onSuccess: (isArchived) => {
        const message = isArchived
          ? t("success_message_archive")
          : t("success_message_unarchive");
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        queryClient.invalidateQueries({ queryKey: ["taskData"] });
        queryClient.invalidateQueries({ queryKey: ["archiveTasks"] });
      },
      onError: (error) => {
        console.error("Error:", error);
        toast.error("Error archiving the item.", {
          position: "top-right",
          autoClose: 3000,
        });
      },
    },
  );
};

export const useUpdateParticipants = (
  taskId: number,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (selectedUsers: string[]) => {
      return axiosClient.put(`/task/${taskId}/participant`, {
        participant: selectedUsers,
      });
    },
    {
      onSuccess: () => {
        onSuccessCallback();
        queryClient.invalidateQueries({ queryKey: ["taskData"] });
      },
      onError: (error) => {
        console.error("Error updating participants:", error);
      },
    },
  );
};

export const useUpdateStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    (status) => axiosClient.put(`/task/${taskId}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["taskData"] });
        queryClient.invalidateQueries({ queryKey: ["tasksDate"] });
        queryClient.invalidateQueries({ queryKey: ["statuses"] });
      },
      onError: (error) => {
        console.log("Update status error:", error);
      },
    },
  );
};

export const useUpdatePriority = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (priority: number) =>
      axiosClient.put(`/task/${taskId}/priority`, { priority }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["taskData"] });
      },
      onError: (error) => {
        console.error("Update priority error:", error);
      },
    },
  );
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["Mytasks"],
    queryFn: taskApi.getTasks,
  });
};
