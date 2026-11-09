import { useMutation, useQueryClient } from "react-query";
import { rolesApi } from "../../api/roles";

export interface roleData {
  role_id: number;
  user_id: number;
}

export const useRoleConnectWithUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: roleData }) =>
      rolesApi.connectRoleWithUser(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupProjectData"] });
    },
    onError: (error) => {
      console.log("Update status error:", error);
    },
  });
};
