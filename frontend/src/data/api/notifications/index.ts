import axiosClient from "../../../common/axiosClient";

export const notificationApi = {
  async changeNotification(id: string | undefined, value: boolean) {
    const res = await axiosClient.put(`/project/${id}/notification_all`, {value});
    return res.data;
  },

  async changeNotificationStatus(id: string | undefined, value: boolean) {
    const res = await axiosClient.put(`/project/${id}/notification_status_all`, {value});
    return res.data;
  },
};