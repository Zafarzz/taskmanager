import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../common/axiosClient";
import { fetchData } from "../../../common/fetchData";

export const useSaveSelectedGroups = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(
    async (selectedGroups: Record<string, boolean>) => {
      const formattedGroups = Object.entries(selectedGroups).map(
        ([group_id, is_selected]) => ({
          group_id: Number(group_id),
          is_selected,
        }),
      );
      return axiosClient.post("/group/selector", formattedGroups);
    },
    {
      onSuccess: () => {
        navigate("/");
        queryClient.invalidateQueries({ queryKey: ["groupsData"] });
        queryClient.invalidateQueries({ queryKey: ["groupSelect"] });
      },
      onError: (error) => {
        console.error("Error saving groups:", error);
      },
    },
  );
};

export const useGroups = () => {
  const fetchGroups = async () => {
    return await fetchData("/user/groups", {});
  };

  return useQuery(["groupsData"], fetchGroups);
};

export const useSuperGroups = (id: number) => {
  const fetchSuperGroups = async () => {
    return await fetchData(`/group/${id}`, {});
  };

  return useQuery({
    queryKey: ["groupData", id],
    queryFn: () => fetchSuperGroups(),
    refetchOnReconnect: true,
  });
};
