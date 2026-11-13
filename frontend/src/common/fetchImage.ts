import axiosClient from './axiosClient';

export const fetchImage = async (id: number) => {
  try {
    const response = await axiosClient.get('/photo/' + id, {
        responseType: 'blob',
    });

    if(response.data.size === 32)
    {
      return '';
    }
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.log('Error fetching profile photo:', error);
    return '';
  }
};
