import { useParams } from "react-router-dom";
import axiosClient from "../common/axiosClient";
import { useQuery } from "react-query";
import { Loader } from "../components/mini/Loader";
import { useEffect, useMemo, useState } from "react";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";
import { useDeleteProject, useEditNotification } from "../data/hooks/project";
import User from "../components/User";
import WebApp from "@twa-dev/sdk";
import {
  useChangeNotificationAll,
  useChangeNotificationStatusAll,
} from "../data/hooks/notifications";
import { UserInterface } from "../data/hooks/users/interface";
import clsx from "clsx";
import { useUserContext } from "../context/UserContext";
import sendImage from '../assets/icons/paperplane.circle.fill.png'

const getProject = async (id: number) => {
  const response = await axiosClient.get("/project/show/" + id);

  return response.data;
};



const send_weekly_status_maual = async (id: number) => {
  const response = await axiosClient.get("/task/send_weekly_status_maual/" + id);
  return response.data;
}

export interface role {
  id?: number;
  name?: string;
  project_id?: number;
  user: number;
}

const GroupSettings = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
  }, []);
  const { id } = useParams();
  const { user } = useUserContext();

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [focusDelete, setFocusDelete] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [confirmationInput, setConfirmationInput] = useState<string>("");

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["groupProjectData", id], () => getProject(Number(id)));

  const { mutate: notificationMutate } = useChangeNotificationAll();
  const { mutate: notificationStatusMutate } = useChangeNotificationStatusAll();

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  const { mutate: projectDelete } = useDeleteProject(Number(id));

  const deleteProject = () => {
    projectDelete();
  };

  const { mutate: editNotifications } = useEditNotification(Number(id));

  const editNotification = (type: string, value: boolean) => {
    editNotifications({ type, value });
  };

  const projectNotificationPermissionsArray = useMemo(() => {
    if (project?.projectNotificationPermissions) {
      return JSON.parse(project.projectNotificationPermissions);
    }
    return [];
  }, [project?.projectNotificationPermissions]);

  const statusNotificationPermissionsArray = useMemo(() => {
    if (project?.statusNotificationPermissions) {
      return JSON.parse(project.statusNotificationPermissions);
    }
    return [];
  }, [project?.statusNotificationPermissions]);

  const hiddenTurnOn = projectNotificationPermissionsArray.some(
    (status: string) =>
      ["create", "edit", "delete", "archive"].includes(status),
  );

  const projectNotificationPermissions = () => {
    notificationMutate({ id, value: !hiddenTurnOn });
  };

  const hiddenTurnOnStatus = statusNotificationPermissionsArray.some(
    (status: string) =>
      ["todo", "in_progress", "testing", "completed"].includes(status),
  );

  const statusNotificationPermissions = () => {
    notificationStatusMutate({ id, value: !hiddenTurnOnStatus });
  };

  if (isLoading) return <Loader />;

  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className='p-3'>
      <div>
        {
          (project.users.length && project.users.find((u: any) => u.telegram_id === String(user.telegram_id) && u.role === 'admin')) ? 
          <div
            onClick={() => send_weekly_status_maual(Number(id))}
            className='h-[50px] flex items-center justify-center mt-4 mb-[42px] gap-2 rounded-xl bg-white  text-customBlue text-[14px] font-medium font-sfpro'
          >
            <span>{t("send_weekly_analytics")}</span>
            <span>
              <img src={sendImage} alt="sendImage"/>
            </span>
          </div>:<></>
        }
      </div>
      <div className='px-3 flex items-center justify-between'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          {t("status_settings")}
        </p>
        <p
          className='font-normal text-[15px] text-customBlue'
          onClick={() => statusNotificationPermissions()}
        >
          {hiddenTurnOnStatus ? t("turn_off_all") : t("turn_on_all")}
        </p>
      </div>

      <div className='mt-2 flex flex-col bg-white rounded-custom-16 overflow-hidden'>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("to_do")}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.statusNotificationPermissions.includes("todo")}
              onChange={() =>
                editNotification(
                  "todo",
                  !project.statusNotificationPermissions.includes("todo"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("in_progress")}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.statusNotificationPermissions.includes(
                "in_progress",
              )}
              onChange={() =>
                editNotification(
                  "in_progress",
                  !project.statusNotificationPermissions.includes(
                    "in_progress",
                  ),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>

        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("testing")}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.statusNotificationPermissions.includes(
                "testing",
              )}
              onChange={() =>
                editNotification(
                  "testing",
                  !project.statusNotificationPermissions.includes("testing"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 capitalize font-sfpro'>
              {t("completed")}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.statusNotificationPermissions.includes(
                "completed",
              )}
              onChange={() =>
                editNotification(
                  "completed",
                  !project.statusNotificationPermissions.includes("completed"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
        {t("noti_text")}
      </p>

      <div className='px-3 flex items-center justify-between mt-5'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          {t("notifications_in_chat")}
        </p>
        <p
          className='font-normal text-[15px] text-customBlue'
          onClick={() => projectNotificationPermissions()}
        >
          {hiddenTurnOn ? t("turn_off_all") : t("turn_on_all")}
        </p>
      </div>
      <div className='mt-2 flex flex-col bg-white rounded-custom-16 overflow-hidden'>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("create_task")}
            </p>
            <p className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'>
              /add
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.projectNotificationPermissions.includes(
                "create",
              )}
              onChange={() =>
                editNotification(
                  "create",
                  !project.projectNotificationPermissions.includes("create"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("edit_task")}
            </p>
            <p className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'>
              /edit
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.projectNotificationPermissions.includes("edit")}
              onChange={() =>
                editNotification(
                  "edit",
                  !project.projectNotificationPermissions.includes("edit"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>

        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("add_task_to_archive")}
            </p>
            <p className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'>
              /archive
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.projectNotificationPermissions.includes(
                "archive",
              )}
              onChange={() =>
                editNotification(
                  "archive",
                  !project.projectNotificationPermissions.includes("archive"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("delete_task")}
            </p>
            <p className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'>
              /delete
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.projectNotificationPermissions.includes(
                "delete",
              )}
              onChange={() =>
                editNotification(
                  "delete",
                  !project.projectNotificationPermissions.includes("delete"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
        {t("noti_text")}
      </p>

      <div className='flex flex-col gap-[7px] bg-white rounded-custom-16 overflow-hidden mt-4'>
        <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
          <div>
            <p className='text-[17px] font-normal leading-6 font-sfpro'>
              {t("show_comments")}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={project.projectNotificationPermissions.includes(
                "comment",
              )}
              onChange={() =>
                editNotification(
                  "comment",
                  !project.projectNotificationPermissions.includes("comment"),
                )
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='py-[12px] px-4 pt-1 text-[13px] font-normal text-customGrayDark'>
        {t("show_comment_text")}
      </p>

      <p className='px-3 text-slate-500 uppercase text-[12px] mt-4 flex gap-2'>
        <span>{t("group_members")}</span>
        <span className='text-customBlack'>{project.users.length}</span>
      </p>
      <div className='mt-2 bg-white rounded-xl'>
        {project.users.map((user: UserInterface, index: number) => (
          <User user={user} roles={project.project_roles} key={index} />
        ))}
        {isLoading && <Loader />}
      </div>
        {
          (project.users.length && project.users.find((u: any) => u.telegram_id === String(user.telegram_id) && u.role === 'admin')) ? 
        <div
          onClick={() => setIsOpenDelete(true)}
          className='h-[50px] flex items-center justify-center mt-4 mb-[42px] rounded-xl bg-gray-300 text-customRed text-[17px] font-medium font-sfpro'
        >
          {capitalizeFirstLetter(t("delete") + " " + t("project"))}
        </div>:<></>
        }

      {isOpenDelete && (
        <div
          className='transition-all bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
          onClick={() => {
            setIsOpenDelete(false);
            setFocusDelete(false);
          }}
        ></div>
      )}
      <div
        className={clsx(
          isOpenDelete
            ? focusDelete && !isAndroid
              ? "bottom-[30%]"
              : "bottom-3"
            : "bottom-[-100%]",
          "z-[100] fixed transition-all rounded-[25px] bg-white p-3 right-3 left-3 flex flex-col gap-2 duration-300",
        )}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-custom-16'>
          <input
            type='text'
            placeholder='Type to here'
            className='w-full h-full bg-transparent outline-none border-none'
            value={confirmationInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmationInput(e.target.value)
            }
            onFocus={() => setFocusDelete(true)}
          />
        </div>
        <p className='text-base font-normal text-customGrayDark px-3 mt-2 leading-4 font-sfpro'>
          {t("delete_confirmation")}
        </p>
        <div>
          {isOpenDelete && (
            <div className='flex gap-4'>
              <div
                className='w-[50%] bottom-[22px] h-[44px] bg-[#f2f2f7] text-[#1e1e1e] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 capitalize font-sfpro text-[14px] font-medium'
                onClick={() => {
                  setConfirmationInput("");
                  setIsOpenDelete(false);
                  setFocusDelete(false);
                }}
              >
                {t("cancel")}
              </div>

              {confirmationInput === "Sure" ? (
                <div
                  className='w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#FF3B30] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium'
                  onClick={() => {
                    deleteProject();
                    setConfirmationInput("");
                    setIsOpenDelete(false);
                  }}
                >
                  {t("delete")}
                </div>
              ) : (
                <div className='w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#FF3B30] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium'>
                  <p className='opacity-35'>{t("delete")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
