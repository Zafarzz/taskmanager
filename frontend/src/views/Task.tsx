import { FaRegComment } from "react-icons/fa6";
import { Avatar } from "../components/mini/Avatar";
import { useCallback, useEffect, useReducer } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { AvatarUser } from "../components/mini/AvatarUser";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { fetchData } from "../common/fetchData";
import { Loader } from "../components/mini/Loader";
import { IoTrash } from "react-icons/io5";
import CommentAndEvent from "../components/CommentAndEvent";
import StatusSelector from "../components/StatusSelector";
import Calendar from "../assets/icons/Calendar";
import User from "../assets/icons/User";
import Users from "../assets/icons/Users";
import ArrowRight from "../assets/icons/ArrowRight";
import Prioritet from "../assets/icons/Prioritet";
import SymbolB from "../assets/icons/SymbolB";
import Square from "../assets/icons/Square";
import "react-toastify/dist/ReactToastify.css";

import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";
import { ICommentIn } from "../components/Comment";
import { IPriority } from "./creteTask/CreateTaskFromGroup";
import { IEventGroup } from "../components/event_promo/EventPromo";
import clsx from "clsx";
import {
  useArchiveTask,
  useDeleteTask,
  useUpdateParticipants,
  useUpdatePriority,
  useUpdateStatus,
} from "../data/hooks/tasks";
import TaskIcon from "../assets/icons/ArchiveIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";

import WebApp from "@twa-dev/sdk";
import { UserInterface } from "../data/hooks/users/interface";
import { IUserFromGroup } from "../components/TopProjectBar";

const getTask = async (id: number) => {
  try {
    return await fetchData("/task/show/" + id, {});
  } catch (error) {
    console.log("Get task error: " + error);
  }
};

const getStatuses = async (id: number) => {
  try {
    return await fetchData("/status/" + id, {});
  } catch (error) {
    console.log("getStatuses error: " + error);
  }
};

interface State {
  users: UserInterface[];
  user: UserInterface | null;
  comments: ICommentIn[];
  events: IEventGroup[];
  selector: string;
  commentText: string;
  commentInput: boolean;
  is_mobile: boolean;
  isAndroid: boolean;
  participants: UserInterface[];
  confirmationInput: string;
  isOpenDelete: boolean;
  isOpenArchive: boolean;
  isOpenComment: boolean;
  openParticipant: boolean;
  selectStatus: null | number;
  selectedUsers: UserInterface[];
  selectPriority: null | IPriority;
  focusDelete: boolean;
}

const initialState: State = {
  users: [],
  user: null,
  comments: [],
  events: [],
  // selector: 'event',
  selector: "comment",
  commentText: "",
  commentInput: false,
  is_mobile: false,
  isAndroid: false,
  participants: [],
  confirmationInput: "",
  isOpenDelete: false,
  isOpenArchive: false,
  isOpenComment: true,
  openParticipant: false,
  selectStatus: null,
  selectedUsers: [],
  selectPriority: null,
  focusDelete: false,
};

const Task = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#FFFFFF");
  }, []);

  const { id } = useParams();
  const { user } = useUserContext();

  const setParticipants = (user: UserInterface) => {
    const check = state.selectedUsers.some(
      (u: UserInterface) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setState({
        selectedUsers: state.selectedUsers.filter(
          (u: UserInterface) => u.telegram_id !== user.telegram_id,
        ),
      });
    } else {
      setState({ selectedUsers: [user, ...state.selectedUsers] });
    }
  };

  const [state, setState] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: State, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const {
    data: task,
    error,
    isLoading,
  } = useQuery(["taskData", id], () => getTask(Number(id)));

  const deleteTaskMutation = useDeleteTask(Number(task?.project_id));

  const { data: statuses } = useQuery(
    ["statusData", { project_id: task?.project_id }],
    () => getStatuses(Number(task?.project_id)),
    {
      enabled: Boolean(task?.project_id),
    },
  );

  const getUsers = useCallback(async () => {
    if (!task) return;

    const selectedUsersPromise = task.taskUser.length
      ? task.taskUser.map((user: IUserFromGroup) => {
          return user.user;
        })
      : Promise.resolve([]);

    const [selectedUsers, participants, comments, events] = await Promise.all([
      selectedUsersPromise,
      task.users,
      task.taskComment,
      task.taskChange,
    ]);

    const details = navigator.userAgent;
    const isMobileDevice = /android|iphone|kindle|ipad/i.test(details);
    const isAndroid = /android/i.test(details);

    const data = {
      user,
      selectedUsers,
      comments,
      events,
      participants,
      is_mobile: isMobileDevice,
      isAndroid,
    };

    setState(data);
  }, [task]);

  useEffect(() => {
    if (task) getUsers();
  }, [task, getUsers]);

  const queryClient = useQueryClient();

  const { mutate: updateStatus } = useUpdateStatus(Number(task?.id));

  const handleStatusUpdate = async (newStatus: number): Promise<void> => {
    updateStatus(newStatus);
  };

  const updatePriorityMutation = useUpdatePriority(task?.id);

  const handleUpdatePriority = (newPriority: number) => {
    updatePriorityMutation.mutate(newPriority);
  };

  const deleteTask = async () => {
    deleteTaskMutation.mutate(Number(id));
  };

  const archiveTaskMutation = useArchiveTask();

  const archiveTask = () => {
    const isArchived = !task.is_archive;
    archiveTaskMutation.mutate({
      isArchived: isArchived,
      taskId: task?.id,
    });
  };

  const updateParticipantsMutation = useUpdateParticipants(Number(id), () => {
    setState({ openParticipant: false });
  });

  const updateParticipants = () => {
    const selectedUserIds = state.selectedUsers.map(
      (user: UserInterface) => user.telegram_id,
    );
    updateParticipantsMutation.mutate(selectedUserIds);
  };

  if (isLoading) return <Loader customClass="h-[100vh]" />;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  const capitalizeFirstChar = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const statusess: { [key: string]: string } = {
    "To do": "to_do",
    "In Progress": "in_progress",
    Testing: "testing",
    Completed: "completed",
  };

  if (!task) return null;

  return (
    <>
      <div className="w-full max-w-[700px] fixed z-10 top-0 left-1/2 -translate-x-1/2 flex justify-between h-[56px] items-center bg-white p-3 shadow-custom">
        <Link to={"/projects/" + task.project_id} className="w-[60px] flex">
          <Avatar
            image={""}
            alt={`${task.project?.name}`}
            id={task.project?.id}
            avatarClass="w-9 h-9 rounded-[10px]"
            textClass="text-[14px]"
          />
        </Link>
        <p className="font-medium text-[17px] text-black font-sfpro">
          {capitalizeFirstLetter(`${task.project?.name}`)}
        </p>
        <div className="text-gray-500 h-full w-[60px] flex items-center"></div>
      </div>
      <div className="h-[56px]"></div>
      <div className="p-3 pt-[12px] flex flex-col gap-[12px]">
        <div className="shadow-customShadow rounded-custom-16 bg-white p-4">
          <div className="flex gap-[10px]">
            <div className="relative top-[2px]">
              <Square />
            </div>
            <p className="font-medium text-[17px] text-black whitespace-pre-line font-sfpro">
              {capitalizeFirstChar(`${task.name}`)}
            </p>
          </div>
          {task.description && (
            <p className="text-[14px] text-customBlackLight mt-2 font-normal whitespace-pre-line font-sfpro">
              {task.description}
            </p>
          )}

          {/* Images */}

          {/* <div className='flex flex-wrap p-[4px] shadow-customCombined rounded-[16px] gap-[2px] mt-[10px]'>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
          </div> */}
        </div>
        <div className="shadow-customShadow rounded-custom-16 bg-white px-3">
          <div className="flex justify-between items-center p-2 h-[44px]">
            <div className="flex justify-between items-center gap-4">
              <div className="text-gray-400">
                <CalendarIcon />
              </div>
              <p className="text-black font-normal text-base font-sfpro">
                {t("created_at")}
              </p>
            </div>
            <p className="text-black font-medium text-[15px] font-sfpro">
              {task.created_at &&
                dateTimeConverter.convertTime(task.created_at)}
            </p>
          </div>
          <div className="flex justify-between items-center p-2 h-[44px]">
            <div className="flex justify-between items-center gap-4">
              <div className="text-gray-400">
                <User />
              </div>
              <p className="text-black font-normal text-base font-sfpro">
                {t("author")}
              </p>
            </div>
            <div className="pr-3">
              <AvatarUser
                alt={`${task.user ? task.user.name : "No user"}`}
                id={task.user?.telegram_id || 0}
              />
            </div>
          </div>
          <div
            className="flex justify-between items-center p-2 h-[44px]"
            onClick={() => setState({ openParticipant: true })}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="text-gray-400">
                <Users />
              </div>
              <p className="text-black font-normal text-base ml-[-5px] font-sfpro">
                {t("performs")}
              </p>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="rounded-custom-16 flex gap-4 items-center cursor-pointer pr-3">
                <div className="flex ">
                  {state.selectedUsers.length > 0 ? (
                    state.selectedUsers.map(
                      (user: UserInterface, index: number) => (
                        <AvatarUser
                          key={index}
                          alt={`${user.name}`}
                          id={user.telegram_id || 0}
                        />
                      ),
                    )
                  ) : (
                    <AvatarUser
                      alt={task.user ? task.user.name : "No user"}
                      id={task.user?.telegram_id || 0}
                    />
                  )}
                </div>
              </div>
              <ArrowRight />
            </div>
          </div>
          {
            <div className="flex justify-between items-center p-2 h-[44px]">
              <div className="flex justify-between items-center gap-4">
                <div className="text-gray-400">
                  <Calendar />
                </div>
                <p className="text-black font-normal text-base font-sfpro">
                  {t("deadline")}
                </p>
              </div>
              <p className="text-black font-medium text-[15px] font-sfpro">
                {task.deadline
                  ? dateTimeConverter.convertDay(task.deadline)
                  : "Not selected"}
              </p>
            </div>
          }

          {/* StoryPoint */}

          {/* <div className='flex justify-between items-center p-2 h-[44px]'>
            <div className='flex justify-between items-center gap-4'>
              <div className='text-gray-400'>
                <Calendar />
              </div>
              <p className='text-black font-normal text-base font-sfpro'>
                {t("story_point")}
              </p>
            </div>
            <div className='pr-3'>
              <p className='font-bold font-sans text-sm'>{task.point}</p>
            </div>
          </div> */}

          {/* <div className="flex justify-between items-center p-2">
                    <div className="flex justify-between items-center gap-2">
                        <div className="text-gray-400">
                            <BsCalendar3 />
                        </div>
                        <p className="text-gray-400 font-bold font-sans">{t('deadline}</p>
                    </div>
                    <p className="font-bold font-sans">{ task.created_at && dateTimeConverter.convert(task.created_at)}</p>
                </div> */}
          {/* <div className="flex justify-between items-center p-2">
                    <div className="flex justify-between items-center gap-2">
                        <div className="text-gray-400">
                            <FaLink />
                        </div>
                        <p className="text-gray-400 font-bold font-sans">{t('file}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex justify-center items-center text-sm">0</div>
                        <div className="text-gray-500">
                            <FaAngleDown />
                        </div>
                    </div>
                </div> */}
        </div>
        <div className="shadow-customShadow rounded-custom-16 bg-white px-3">
          <div className="flex justify-between items-center p-2">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-[1px] items-end justify-center">
                <Prioritet />
              </div>
              <p className="text-black font-normal text-base font-sfpro">
                {capitalizeFirstLetter(t("priority"))}
              </p>
            </div>
            <div
              onClick={() => setState({ selectPriority: task.priority })}
              className={clsx(
                "text-customBlackLight h-7 text-[15px] flex items-center gap-[4px] font-sans font-normal rounded-[8px] px-[12px] py-[4px]",
                {
                  "bg-customRedLight": task.priority === 3,
                  "bg-customYellow1": task.priority === 2,
                  "bg-customGreen": task.priority === 1,
                },
              )}
            >
              {t(`priority_data_${task.priority}`)}
              <ArrowRight />
            </div>
          </div>
          <div className="flex justify-between items-center p-2">
            <div className="flex justify-between items-center gap-4">
              <div>
                <SymbolB />
              </div>
              <div className="text-black font-normal text-base font-sfpro">
                {t("status")}
              </div>
            </div>
            <div
              onClick={() => setState({ selectStatus: task.status.id })}
              className={clsx(
                "text-customBlackLight h-7 text-[15px] flex items-center gap-[4px] font-sans font-normal rounded-[8px] px-[12px] py-[4px] bg-[#F2F2F7]",
                {
                  "bg-customBlueLight": task.status?.name === "In Progress",
                  "bg-customRedLight": task.status?.name === "Testing",
                  "bg-customGreen": task.status?.name === "Completed",
                },
              )}
            >
              {t(statusess[task.status?.name])}
              <ArrowRight />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "shadow-customShadow rounded-custom-16 bg-white py-[14px] px-4",
            {
              "pb-[300px]":
                state.commentInput &&
                Number(user.telegram_id) === Number(task.user_id),
              "pb-[350px]":
                state.commentInput &&
                Number(user.telegram_id) !== Number(task.user_id),
            },
          )}
        >
          <div
            className="flex justify-between items-center px-2"
            onClick={() => setState({ isOpenComment: !state.isOpenComment })}
          >
            <div className="transition-all flex justify-between items-center gap-2">
              <div className="flex gap-[1px] items-end justify-center text-gray-400">
                <FaRegComment />
              </div>
              <p className="text-gray-400 font-bold font-sans">
                {t("comments_and_events")}
              </p>
            </div>
            <div className="transition-all flex items-center gap-3">
              <div
                className={clsx(
                  "text-blue-500 text-sm font-sans font-bold bg-blue-200 rounded-full flex justify-center items-center",
                  task.taskChange?.length + task.taskComment?.length <= 9
                    ? "w-5 h-5 p-0"
                    : "w-auto py-[3px] px-[6px]",
                )}
              >
                <p className="text-gradient-blue">
                  {task.taskChange?.length + task.taskComment?.length}
                </p>
              </div>
              <div className={clsx(state.isOpenComment && "rotate-90")}>
                <ArrowRight />
              </div>
            </div>
          </div>
          {state.isOpenComment && (
            <>
              <div className="bg-gray-100 flex p-1 rounded-full mt-[25px]">
                <div
                  onClick={() => setState({ selector: "comment" })}
                  className={clsx(
                    "transition w-[50%] rounded-full text-center text-sm font-sans font-medium py-1 cursor-pointer",
                    state.selector === "comment"
                      ? "bg-blue-200"
                      : "text-gray-400",
                  )}
                >
                  <p
                    className={clsx(
                      "event_title lowercase font-sfpro text-sm",
                      state.selector === "comment" && "text-gradient-blue",
                    )}
                  >
                    {t("comments")} {task.taskComment?.length}
                  </p>
                </div>
                <div
                  onClick={() => setState({ selector: "event" })}
                  className={clsx(
                    "transition w-[50%] rounded-full text-center text-sm font-sans font-medium py-1 cursor-pointer",
                    state.selector === "event"
                      ? "bg-blue-200 text-blue-500"
                      : "text-gray-400",
                  )}
                >
                  <p
                    className={clsx(
                      "event_title lowercase font-sfpro",
                      state.selector === "event" && "text-gradient-blue",
                    )}
                  >
                    {t("events")} {task.taskChange?.length}
                  </p>
                </div>
              </div>
              <CommentAndEvent
                setState={setState}
                state={state}
                queryClient={queryClient}
              />
            </>
          )}
        </div>

        <div className="flex mt-3 gap-3 pb-[50px]">
          <div
            onClick={() => setState({ isOpenDelete: true })}
            className="w-full h-[55px] bg-customGrey4 rounded-xl text-[#FF3B30] flex flex-col justify-center items-center"
          >
            <div>
              <IoTrash size={20} />
            </div>
            <p className="text-[12px]">{t("delete")}</p>
          </div>
          <div
            onClick={() => setState({ isOpenArchive: true })}
            className="w-full h-[55px] bg-customGrey4 rounded-xl flex flex-col justify-center items-center"
          >
            {!task.is_archive ? (
              <div>
                <TaskIcon />
              </div>
            ) : (
              <div className="rotate-[180deg]">
                <TaskIcon />
              </div>
            )}
            <p className="text-[12px]">
              {!task.is_archive ? t("archive") : t("unarchive")}
            </p>
          </div>
        </div>
      </div>
      {statuses && (
        <StatusSelector
          selectStatus={state.selectStatus}
          setSelectStatus={setState}
          statuses={statuses}
          handleStatusUpdate={handleStatusUpdate}
        />
      )}

      {state.selectPriority && (
        <div
          className="transition-all bg-black opacity-45 z-10 fixed top-0 w-full h-full"
          onClick={() => setState({ selectPriority: null })}
        ></div>
      )}
      <div
        className={clsx(
          "z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 right-3 left-3 flex flex-col gap-2",
          state.selectPriority ? "bottom-3" : "bottom-[-100%]",
        )}
      >
        {priorities.map((priority: IPriority, index: number) => (
          <div
            onClick={() => {
              handleUpdatePriority(index + 1);
              setState({ selectPriority: null });
            }}
            key={index}
            className={clsx(
              "p-4 rounded-xl flex justify-between items-center",
              index + 1 === state.selectPriority && "bg-gray-100",
            )}
          >
            <div className="flex gap-4">
              <div
                className={clsx(
                  index + 1 === state.selectPriority && "text-blue-600",
                )}
              >
                {t(priority.title)}
              </div>
            </div>
            <div
              className={clsx(
                index + 1 === state.selectPriority
                  ? "border-blue-500"
                  : "border-gray-400",
                "flex justify-center items-center rounded border w-5 h-5",
              )}
            >
              {index + 1 === state.selectPriority && (
                <div className="bg-custom-gradient-blue w-3 h-3 rounded-sm"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.openParticipant && (
        <div
          className="bg-black opacity-45 z-10 fixed top-0 w-full h-full"
          onClick={() => {
            setState({ openParticipant: false });
          }}
        ></div>
      )}
      <div
        className={clsx(
          state.openParticipant ? "bottom-3" : "bottom-[-100%]",
          "overflow-y-scroll max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 pb-[78px] pt-3 mb-[10px] left-3 right-3 flex flex-col gap-2 scrollbar-hidden",
        )}
      >
        {state.participants.length > 0 ? (
          state.participants.map((user: UserInterface, index: number) => (
            <div
              key={index}
              onClick={() => {
                setParticipants(user);
              }}
              className={clsx(
                state.selectedUsers.some(
                  (u: UserInterface) => u.telegram_id === user.telegram_id,
                ) && "bg-gray-100",
                "p-4 rounded-2xl flex justify-between items-center",
              )}
            >
              <div className="flex gap-[27px]">
                <AvatarUser
                  alt={`${user.name}`}
                  id={user.telegram_id || 0}
                  width={28}
                />
                <div>{user.name}</div>
              </div>
              <div
                className={clsx(
                  state.selectedUsers.some(
                    (u: { telegram_id: number }) =>
                      u.telegram_id === user.telegram_id,
                  )
                    ? "border-blue-500"
                    : "border-gray-400",
                  "flex justify-center items-center rounded border w-5 h-5",
                )}
              >
                {state.selectedUsers.some(
                  (u: { telegram_id: number }) =>
                    u.telegram_id === user.telegram_id,
                ) && (
                  <div className="bg-custom-gradient-blue w-3 h-3 rounded-sm"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
        <div>
          {state.openParticipant && (
            <div className="bg-white rounded-b-[25px] h-[84px] fixed bottom-5 left-3 right-3">
              <div
                className=" fixed left-6 right-6 bottom-9 bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-2xl mt-3"
                onClick={() => updateParticipants()}
              >
                {t("choose")}
              </div>
            </div>
          )}
        </div>
      </div>
      {state.isOpenDelete && (
        <div
          className="transition-all bg-black opacity-45 z-10 fixed top-0 w-full h-full"
          onClick={() => setState({ isOpenDelete: false, focusDelete: false })}
        ></div>
      )}
      <div
        className={clsx(
          state.isOpenDelete
            ? state.focusDelete && !state.isAndroid
              ? "bottom-[30%]"
              : "bottom-3"
            : "bottom-[-100%]",
          "z-[100] fixed transition-all rounded-[25px] bg-white p-3 right-3 left-3 flex flex-col gap-2 duration-300",
        )}
      >
        <div className="w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-custom-16">
          <input
            type="text"
            placeholder="Type to here"
            className="w-full h-full bg-transparent outline-none border-none"
            value={state.confirmationInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setState({ confirmationInput: e.target.value })
            }
            onFocus={() => setState({ focusDelete: true })}
          />
        </div>
        <p className="text-base font-normal text-customGrayDark px-3 mt-2 leading-4 font-sfpro">
          {t("delete_confirmation")}
        </p>
        <div>
          {state.isOpenDelete && (
            <div className="flex gap-4">
              <div
                className="w-[50%] bottom-[22px] h-[44px] bg-[#f2f2f7] text-[#1e1e1e] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 capitalize font-sfpro text-[14px] font-medium"
                onClick={() => {
                  setState({
                    confirmationInput: "",
                    isOpenDelete: false,
                    focusDelete: false,
                  });
                }}
              >
                {t("cancel")}
              </div>

              {state.confirmationInput === "Sure" ? (
                <div
                  className="w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#FF3B30] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium"
                  onClick={() => {
                    deleteTask();
                    setState({ confirmationInput: "", isOpenDelete: false });
                  }}
                >
                  {t("delete")}
                </div>
              ) : (
                <div className="w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#FF3B30] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium">
                  <p className="opacity-35">{t("delete")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {state.isOpenArchive && (
        <div
          className="transition-all bg-black opacity-45 z-10 fixed top-0 w-full h-full"
          onClick={() => setState({ isOpenArchive: false })}
        ></div>
      )}
      <div
        className={clsx(
          state.isOpenArchive
            ? "bottom-[50%] translate-y-[50%]"
            : "bottom-[-100%]",
          "z-[10] fixed transition-all rounded-[25px] bg-white p-7 right-3 left-3 flex flex-col gap-2",
        )}
      >
        <p className="text-[17px] font-medium text-[#1e1e1e] px-3 leading-4 font-sfpro text-center">
          {task.is_archive
            ? t("unarchive_confirmation")
            : t("archive_confirmation")}
        </p>
        <div className="mt-2">
          {state.isOpenArchive && (
            <div className="flex gap-2">
              <div
                className="w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#1e1e1e] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium"
                onClick={() => {
                  setState({ isOpenArchive: false });
                }}
              >
                <p>{t("cencel")}</p>
              </div>

              <div
                className="w-[50%] h-[44px] bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium"
                onClick={() => {
                  archiveTask(), setState({ isOpenArchive: false });
                }}
              >
                <p>{t("confirm")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Task;

const priorities: IPriority[] = [
  {
    title: "priority_data_1",
  },
  {
    title: "priority_data_2",
  },
  {
    title: "priority_data_3",
  },
];
