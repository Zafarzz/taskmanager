import axiosClient from "./axiosClient";

export interface IUserData {
  id: number,
  first_name: string,
  username: string | undefined,
  language_code: string | undefined,
}

export const sendData = async (path: string, data: IUserData, accountId: number) => {
  try {
    const response = await axiosClient.post(path, data);
    localStorage.setItem(`accessToken_${accountId}`, JSON.stringify(response?.data?.token));
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};
