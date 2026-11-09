import axiosClient from './axiosClient';

export const fetchData = async (path: string, params: any) => {
  try {
    const response = await axiosClient.get(path, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
