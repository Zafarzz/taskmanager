import axiosClient from "./axiosClient";

export const fetchPutData = async (path: string, data: any) => {
  try {
    const response = await axiosClient.put(path, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};