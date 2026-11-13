import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../common/axiosClient";
import { toast } from "react-toastify";
import { t } from "i18next";

export const useDeleteProject = (id: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => axiosClient.delete(`/project/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
      toast.success(t("delete project success"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(t("delete project unseccess"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      console.log("Delete project error:", error);
    },
  });
};

export const useEditNotification = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, value }: { type: string; value: boolean }) =>
      axiosClient.put(`/project/${id}/notification`, { type, value }),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupProjectData", String(id)]);
      queryClient.invalidateQueries(["groupProjectData"]);
    },
  });
};
