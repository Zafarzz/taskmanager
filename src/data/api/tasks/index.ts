import axiosClient from "../../../common/axiosClient";
import { ITaskData } from "../../hooks/tasks/interface";

export const taskApi = {
  async createTask(taskData: ITaskData) {
    const res = await axiosClient.post("task/create", taskData);
    return res.data;
  },

  async deleteTask(id: number) {
    const res = await axiosClient.delete(`task/${id}`);
    return res.data;
  },

  async getTasks() {
    const response = await axiosClient.get("/user/tasks");
    return response.data;
  },
};
