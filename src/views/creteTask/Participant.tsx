import { t } from "i18next";
import { AvatarUser } from "../../components/mini/AvatarUser";
import ArrowRight from "../../assets/icons/ArrowRight";
import User from "../../assets/icons/User";
import { useCallback, useEffect, useState } from "react";
import getUsersData from "../../common/getUsersData";
import { UserInterface } from "../../data/hooks/users/interface";
import { IUserFromGroup } from "../../components/TopProjectBar";

interface IParticipant {
  setSelectedUsers: (users: UserInterface[]) => void;
  selectedUsers: UserInterface[];
  project: IParticipantProject;
  project_id: number;
}

interface IParticipantProject {
  group_id: number;
}

const Participant = ({
  setSelectedUsers,
  selectedUsers,
  project,
  project_id,
}: IParticipant) => {
  const [users, setUsers] = useState([]);
  const [openParticipant, setOpenParticipant] = useState(false);


  const getUsers = useCallback(async () => {
    const result = await getUsersData(`${project.group_id}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    setUsers(result);
  }, [project.group_id]);

  useEffect(() => {
    if (project) {
      getUsers();
    }
  }, [project, project_id, getUsers]);


  const setParticipants = (user: UserInterface) => {
    const check = selectedUsers.some(
      (u: UserInterface) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setSelectedUsers(
        selectedUsers.filter((u: UserInterface) => u.telegram_id !== user.telegram_id),
      );
    } else {
      setSelectedUsers([user, ...selectedUsers]);
    }
  };
  return (
    <>
      <div className='h-[44px] flex justify-between items-center px-4'>
        <div className='flex justify-between items-center gap-2'>
          <div className='text-gray-400'>
            <User />
          </div>
          <p className='text-black text-base font-normal capitalize font-sfpro'>
            {t("performs")}
          </p>
        </div>

        <div
          className='flex items-center gap-1 text-gray-400'
          onClick={() => setOpenParticipant(true)}
        >
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user: UserInterface, index: number) => (
              <AvatarUser
                key={index}
                alt={`${user.name ? user.name : "No user"}`}
                id={user.telegram_id}
              />
            ))
          ) : (
            <p className='font-normal text-base text-customBlack mr-[-10px] font-sfpro'>
              {t("appoint")}
            </p>
          )}
          <div className='ml-3'>
            <ArrowRight />
          </div>
        </div>
      </div>
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
            setSelectedUsers([]);
          }}
        ></div>
      )}
      <div
        className={`${
          openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 pb-[85px] pt-3 left-3 right-3 flex flex-col gap-y-1 scrollbar-hidden`}
      >
        {users.map((user: IUserFromGroup, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user.user);
            }}
            className={`${
              selectedUsers.some(
                (u: UserInterface) => u.telegram_id === user.user_id,
              )
                ? "bg-gray-100"
                : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <AvatarUser
                alt={`${user.user.name}`}
                id={user.user_id}
                width={28}
              />
              <div>{user.user.name}</div>
            </div>
            <div
              className={`${
                selectedUsers.some(
                  (u: UserInterface) => u.telegram_id === user.user_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {selectedUsers.some(
                (u: UserInterface) => u.telegram_id === user.user_id,
              ) && <div className='bg-custom-gradient-blue w-3 h-3 rounded-sm'></div>}
            </div>
          </div>
        ))}
        <div>
          {openParticipant && (
            <div className='bg-white rounded-b-[25px] h-[83px] fixed bottom-3 left-3 right-3'>
              <div
                className='fixed bottom-7 bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
                onClick={() => setOpenParticipant(false)}
              >
                {t("choose")}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Participant;
