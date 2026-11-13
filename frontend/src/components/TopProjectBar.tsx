import { useState } from "react";
import { AvatarUser } from "./mini/AvatarUser";
import { Avatar } from "./mini/Avatar";
import { Link } from "react-router-dom";
import Archive from "../assets/icons/Archive";
import { Setting } from "../assets/icons/Setting";
import ArrowDown from "../assets/icons/ArrowDown";
import { t } from "i18next";
import { IState } from "./ProjectCarusel";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import useUserColor from "../common/useUserColor";
import { UserInterface } from "../data/hooks/users/interface";

interface IStateProp {
  name: string;
  mytasks?: number;
  users: UserInterface[];
}

interface IProps {
  state: IStateProp;
  setState: React.Dispatch<Partial<IState>>;
  id: number;
  group_id: number;
  mono_topic: boolean;
  group_name: string;
}

export interface IUserFromGroup {
  group_id?: string;
  is_selected: boolean;
  user: UserInterface;
  user_id: number;
}

export const TopProjectBar = (props: IProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const [openParticipant, setOpenParticipant] = useState<boolean>(false);
  const { state, setState, id, group_id, group_name, mono_topic } = props;

  const getParticipantText = (count: number) => {
    if (count === 1) {
      return t("participant", { count });
    } else if (count > 1 && count < 5) {
      return t("participant_1", { count });
    } else {
      return t("participant_2", { count });
    }
  };

  const setParticipants = (user: UserInterface) => {
    const check = selectedUsers.some(
      (u: UserInterface) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setSelectedUsers(
        selectedUsers.filter(
          (u: UserInterface) => u.telegram_id !== user.telegram_id,
        ),
      );
    } else {
      setSelectedUsers([user, ...selectedUsers]);
    }
  };

  const updateParticipants = async () => {
    setState({
      selectedUsers: selectedUsers
        .map((user: UserInterface) => user.telegram_id)
        .join(","),
    });
    setOpenParticipant(false);
  };

  const { color120 } = useUserColor(id);

  return (
    <>
      <header className='w-[100%] top-0 transition-all fixed z-20 h-[56px] bg-white max-w-[700px] mx-auto flex justify-between items-center px-[20px]'>
        <div className='w-[50%] flex items-center text-gray-700 gap-2 cursor-pointer'>
          <div>
            <div
              style={{ borderWidth: 2, borderColor: color120 }}
              className='w-10 h-10 rounded-[12px] overflow-hidden'
            >
              <Avatar
                image={""}
                alt={!mono_topic ? state.name : group_name}
                radius={10}
                id={!mono_topic ? id : group_id}
                borderColor={`${color120}`}
                avatarClass='w-full h-full rounded-[10px]'
                textClass='text-[14px]'
              />
            </div>
          </div>
          <div className='w-[65%]'>
            <div className='w-[100%] text-[17px] text-black leading-6 font-sfpro single-line-ellipsis'>
              {capitalizeFirstLetter(mono_topic ? group_name : state.name)}
            </div>
            {state.mytasks && (
              <p className='text-[13px] text-customGrayDark leading-3 font-sfpro'>
                {getParticipantText(state.users && state.users.length)}
              </p>
            )}
          </div>
        </div>
        <div className='flex gap-2 items-center h-full'>
          <div className={state.mytasks ? `hidden` : `relative`}>
            <div className='border w-auto h-max absolute -top-4 right-[83px] rounded-[25px]'>
              <div
                className=' z-10 min-w-[60px] flex gap-4 items-center p-1 cursor-pointer'
                onClick={() => {
                  setState({ selector: false });
                  setOpenParticipant(true);
                }}
              >
                <div className='flex '>
                  {selectedUsers.length === 0 ? (
                    <>
                      {state.users && state.users.length > 3 ? (
                        <>
                          {state.users
                            .slice(0, 3)
                            .map((user: UserInterface, index: number) => (
                              <AvatarUser
                                key={index}
                                alt={`${user.name}`}
                                id={user.telegram_id}
                              />
                            ))}
                          <div
                            className={` mr-[-12px] w-[24px] h-[24px] min-w-[24px] min-h-[24px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                          >
                            <p className='relative top-[1px]'>
                              +
                              {state.users.length - 3 >= 9
                                ? 9
                                : state.users.length - 3}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          {state.users.map(
                            (user: UserInterface, index: number) => (
                              <AvatarUser
                                key={index}
                                alt={`${user.name}`}
                                id={user.telegram_id}
                              />
                            ),
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {selectedUsers.length > 3 ? (
                        <>
                          {selectedUsers
                            .slice(0, 3)
                            .map((user: UserInterface, index: number) => (
                              <AvatarUser
                                key={index}
                                alt={`${user.name}`}
                                id={user.telegram_id}
                              />
                            ))}
                          <div
                            className={` mr-[-12px] w-[28px] h-[28px] min-w-[24px] min-h-[24px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                          >
                            +{selectedUsers.length - 3}
                          </div>
                        </>
                      ) : (
                        <>
                          {selectedUsers.map(
                            (user: UserInterface, index: number) => (
                              <AvatarUser
                                key={index}
                                alt={`${user.name}`}
                                id={user.telegram_id}
                              />
                            ),
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className='text-gray-400'>
                  <ArrowDown />
                </div>
              </div>
            </div>
          </div>
          <Link
            to={`/project/${id}/archive`}
            className='text-[20px] h-full w-[36px] absolute right-[55px] rounded text-gray-300 flex items-center justify-center cursor-pointer'
          >
            <Archive />
          </Link>
          <Link
            to={"/projects/" + id + "/settings"}
            className='text-[28px] h-full w-[36px] absolute right-3 rounded text-gray-300 flex items-center justify-center cursor-pointer'
          >
            <Setting width={28} height={28} fill={"rgba(0, 0, 0, 0.2)"} />
          </Link>
        </div>
      </header>
      <div className='h-[56px] w-full'></div>
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
          }}
        ></div>
      )}
      <div
        className={`${
          openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed left-3 right-3 scrollbar-hidden transition-all rounded-[25px] bg-white px-3 py-5 pb-[72px] flex flex-col gap-2`}
      >
        {state.users.map((user: UserInterface, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              selectedUsers.some(
                (u: UserInterface) => u.telegram_id === user.telegram_id,
              )
                ? "bg-gray-100"
                : ""
            }  p-4 rounded-2xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <AvatarUser alt={`${user.name}`} id={user.telegram_id} />
              <div>{user.name}</div>
            </div>
            <div
              className={`${
                selectedUsers.some(
                  (u: UserInterface) => u.telegram_id === user.telegram_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {selectedUsers.some(
                (u: UserInterface) => u.telegram_id === user.telegram_id,
              ) && <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>}
            </div>
          </div>
        ))}
        <div>
          {openParticipant && (
            <div className='bg-white rounded-b-[25px] h-[83px] fixed bottom-3 left-3 right-3'>
              <div
                className=' fixed left-6 right-6 bottom-6 bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-2xl mt-3'
                onClick={() => updateParticipants()}
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
