import axiosClient from "../../../common/axiosClient";

export const eventsApi = {
  async getEvntsNew() {
    const res = await axiosClient.get('user/events');
    return res.data;
  },
  async getEvents() {
    const res = await axiosClient.get("user/events?is_viewed=1");
    return res.data;
  }
}