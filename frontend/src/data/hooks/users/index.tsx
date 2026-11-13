import { useQuery } from 'react-query';
import getUsersData from '../../../common/getUsersData';

export const useGetUsers = (groupId: number) => {
  return useQuery(['users', groupId], () => getUsersData(groupId.toString()), {
    enabled: !!groupId
  });
};
