import { dateTimeConverter } from "../common/dateTimeConverter";
import { useNavigate } from "react-router-dom";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";
import clsx from "clsx";
import { t } from "i18next";
import { useArchiveTask, useDeleteTask } from "../data/hooks/tasks";

interface IArchive {
  archive: IArchiveIn;
}

export interface IArchiveIn {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  task_count: number;
  is_archive: boolean;
}

const ArchiveComponent = (props: IArchive) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpenArchive, setIsOpenArchive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [focusDelete, setFocusDelete] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const navigate = useNavigate();

  const locationNavigator = () => {
    navigate("/tasks/" + props.archive.id);
  };

  const archiveTaskMutation = useArchiveTask();

  const archiveTask = () => {
    const isArchived = !props.archive.is_archive;
    archiveTaskMutation.mutate({
      isArchived: isArchived,
      taskId: props.archive.id,
    });
  };

  const deleteTaskMutation = useDeleteTask();

  const deleteTask = async () => {
    deleteTaskMutation.mutate(Number(props.archive.id));
  };

  return (
    <>
      <div className='relative'>
        <div
          className='absolute z-[1] right-4 top-[12px] text-2xl text-gray-400'
          onClick={() => setIsOpenPopup(true)}
        >
          <HiOutlineDotsHorizontal />
        </div>
        <div
          onClick={locationNavigator}
          className='bg-white p-4 rounded-custom-16 z-0'
        >
          <p className='w-[90%] font-medium text-[17px] text-customBlack1E single-line-ellipsis font-sfpro'>
            {capitalizeFirstLetter(props.archive.name)}
          </p>
          <p className='font-light text-[14px] text-customBlack mt-1 mb-1 duo-line-ellipsis font-sfpro'>
            {capitalizeFirstLetter(props.archive.description)}
          </p>
          <div className='flex items-center justify-between mt-3'>
            <p className='font-medium text-[13px] text-customBlack font-sfpro'>
              {dateTimeConverter.convertTime(props.archive.created_at)}
            </p>
          </div>
        </div>
        {isOpenPopup && (
          <div
            className='transition-all bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
            onClick={() => setIsOpenPopup(false)}
          ></div>
        )}
        <div
          className={clsx(
            isOpenPopup ? "bottom-[4%]" : "bottom-[-100%]",
            "z-[100] fixed transition-all rounded-[25px] bg-white p-4 right-3 left-3 flex flex-col gap-2",
          )}
        >
          <div
            className='h-[52px] py-4 px-3 bg-customGrey rounded-xl flex items-center justify-center'
            onClick={() => {
              setIsOpenPopup(false);
              setIsOpenArchive(true);
            }}
          >
            <p className='text-gradient-blue text-sm font-sfpro font-medium'>
              Развархивировать
            </p>
          </div>
          <div
            className='h-[52px] py-4 px-3 bg-customGrey rounded-xl flex items-center justify-center'
            onClick={() => {
              setIsOpenPopup(false);
              setIsOpenDelete(true);
            }}
          >
            <p className='text-[#FF3B30] text-sm font-sfpro font-medium'>
              Удалить задачу
            </p>
          </div>
        </div>
      </div>

      {isOpenArchive && (
        <div
          className='transition-all bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
          onClick={() => setIsOpenArchive(false)}
        ></div>
      )}
      <div
        className={clsx(
          isOpenArchive ? "bottom-[50%] translate-y-[50%]" : "bottom-[-100%]",
          "z-[100] fixed transition-all rounded-[25px] bg-white p-7 right-3 left-3 flex flex-col gap-2",
        )}
      >
        <p className='text-[17px] font-medium text-[#1e1e1e] px-3 leading-4 font-sfpro text-center'>
          {t("unarchive_confirmation")}
        </p>
        <div className="mt-2">
          {isOpenArchive && (
            <div className='flex gap-2'>
              <div className='w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#1e1e1e] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium' onClick={() => setIsOpenArchive(false)}>
                <p>{t("Отмена")}</p>
              </div>

              <div className='w-[50%] h-[44px] bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium' onClick={() => {
                archiveTask()
                setIsOpenArchive(false);
              }}>
                <p>{t("Подтвердить")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpenDelete && (
        <div
          className='transition-all bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
          onClick={() => {
            setFocusDelete(false);
            setIsOpenDelete(false);
          }}
        ></div>
      )}
      <div
        className={clsx(
          isOpenDelete
            ? focusDelete
              ? "bottom-[30%]"
              : "bottom-3"
            : "bottom-[-100%]",
          "z-[100] fixed transition-all rounded-[25px] bg-white p-3 right-3 left-3 flex flex-col gap-2",
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
            <div className='flex gap-2'>
              <div
                className='w-[50%] bottom-[22px] h-[44px] bg-[#f2f2f7] text-[#1e1e1e] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 capitalize font-sfpro text-[14px] font-medium'
                onClick={() => {
                  setIsOpenDelete(false);
                  setConfirmationInput("");
                }}
              >
                {t("cancel")}
              </div>

              {confirmationInput === "Sure" ? (
                <div
                  className='w-[50%] h-[44px] bottom-[22px] bg-[#f2f2f7] text-[#FF3B30] flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer font-sfpro text-[14px] font-medium'
                  onClick={() => {
                    deleteTask();
                    setIsOpenDelete(false);
                    setConfirmationInput("");
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
    </>
  );
};

export default ArchiveComponent;
