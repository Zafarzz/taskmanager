import axiosClient from "./axiosClient";

interface User {
    telegram_id: string,
    name: string,
    username: string,
    phone: string,
    language_code: string
}

interface GroupUser {
    group_id: string,
    user_id: string,
    is_selected: boolean,
    user: User
}

interface DynamicObject {
    [key: string]: GroupUser[];
}

const usersByGroups: DynamicObject = {};

const getData = async (id: string) => {
    const {data} = await axiosClient.get(`/group/${id}/users`);
    return data;
}

const getUsersData = async (group_id: string) => {
    if(usersByGroups[group_id])
    {    
        return usersByGroups[group_id];
    }else{
        const groupUsers = await getData(group_id);
        return groupUsers;
    }
};

export default getUsersData;