import axiosClient from "../../../common/axiosClient";
import { roleData } from "../../hooks/roles";

export const rolesApi = {
  async connectRoleWithUser(id: number | undefined, role: roleData) {
    const res = await axiosClient.post(`/project/${id}/connect-role`, role);
    return res.data;
  },
}