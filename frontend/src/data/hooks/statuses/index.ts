import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../components/ProjectCarusel';
import { fetchData } from '../../../common/fetchData';
import { IStatus } from '../../../components/ProjectCarusel'; 

const useGetStatuses = (
  id: number,
  selectedUsers: string,
  options?: Omit<UseQueryOptions<IStatus[], unknown, IStatus[], [string, number, string]>, 'queryKey' | 'queryFn'>
) => {
  const getStatuses = async (): Promise<IStatus[]> => {
    const params: Params = {};
    if (selectedUsers !== "") {
      params.user_ids = selectedUsers;
    }
    const response = await fetchData("/status/" + id, params);
    return response;
  };

  return useQuery(['statuses', id, selectedUsers] as [string, number, string], getStatuses, {
    enabled: true,
    ...options,
  });
};

export default useGetStatuses;
