import { ReactElement } from "react";
import Archive from "../assets/icons/Archive";
import CommentEvent from "../assets/icons/CommentEvent";
import Loop from "../assets/icons/Loop";
import PlusIcon from "../assets/icons/PlusIcon";
import Priority from "../assets/icons/Priority";
import UsersIcon from "../assets/icons/UsersIcon";
import { AvatarUser } from "./mini/AvatarUser";
import { IEventCard } from "./CommentAndEvent";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { t } from "i18next";
import { FaArrowRight } from "react-icons/fa6";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import useUserColor from "../common/useUserColor";

interface IProp {
  eventElement: IEventCard;
}

const EventCard = (props: IProp) => {
  const { eventElement } = props;

  const { color1000 } = useUserColor(eventElement.user.telegram_id);

  return (
    <div className='flex gap-2'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <div className='min-w-[24px] w-[24px] min-h-[24px] h-[24px] flex justify-center items-center rounded-full bg-customGrey text-gray-600'>
          <div>{iconMap[eventElement.type as IconType]}</div>
        </div>
        <div className='w-[3px] rounded-full h-[100%] bg-customGrayLight'></div>
      </div>
      <div className='pb-[15px]'>
        <div className='flex gap-2 items-center'>
          <AvatarUser
            alt={eventElement.user?.name}
            width={20}
            height={20}
            id={eventElement.user.telegram_id}
            textClass='text-[11px]'
          />
          <span
            style={{ color: color1000, }}
            className='ml-2 text-[15px] font-[400] font-sfpro'
          >
            {eventElement.user.name}
          </span>
          <span className='font-sans text-[13px] text-customBlack font-[500]'>
            {dateTimeConverter.convertTime(eventElement.created_at)}
          </span>
        </div>
        <div className='mt-3  font-sans text-sm  font-[500]'>
          {eventElement.type === "created" && (
            <p className='text-[13px] font-medium text-customBlackLight font-sfpro'>
              {t("created_task")}
            </p>
          )}
          {eventElement.type === "archive" && (
            <p className='text-[13px] font-medium text-customBlackLight font-sfpro'>
              {eventElement.new_value}
            </p>
          )}
          {eventElement.type === "status" && (
            <>
              <p className='text-[13px] font-medium text-customBlackLight pb-[10px] font-sfpro'>
                {t("change_status")}
              </p>
              <div className='flex mt-2 items-center gap-2'>
                <div
                  className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customBlueLight text-customBlue line-through lowercase event_title`}
                >
                  {eventElement.old_value}
                </div>
                <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                  {" "}
                  <FaArrowRight />
                </div>
                <div className='rounded-full text-[12px] py-[4px] px-[6px] bg-customIndigoLight text-customIndigo lowercase event_title'>
                  {eventElement.new_value}
                </div>
              </div>
            </>
          )}
          {eventElement.type === "priority" && (
            <>
              <p className='text-[13px] font-medium text-customBlackLight pb-[10px] font-sfpro'>
                {t("priority_change")}
              </p>
              <div className='flex mt-2 items-center gap-2'>
                <div
                  className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customYellowLight text-customYellow line-through lowercase event_title`}
                >
                  {t(getPriorityText(Number(eventElement.old_value)))}
                </div>
                <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                  {" "}
                  <FaArrowRight />
                </div>
                <div
                  className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customRedLight text-customRed lowercase event_title`}
                >
                  {t(getPriorityText(Number(eventElement.new_value)))}
                </div>
              </div>
            </>
          )}
          {eventElement.type === "comment" && (
            <>
              <p className='text-[13px] font-medium text-customBlackLight pb-[5px] font-sfpro'>
                {t("comment")}
              </p>
              <div className='flex mt-2 items-center gap-2'>
                <div className='rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-[#F2F2F7] text-[12px] px-3 text-customBlackLight py-1'>
                  {capitalizeFirstLetter(eventElement.new_value)}
                </div>
              </div>
            </>
          )}
          {eventElement.type === "participant" && (
            <>
              <p className='text-[13px] font-medium text-customBlackLight pb-[5px] font-sfpro'>
                {t("participants_changed")}
              </p>
              <div className='flex mt-2 items-center gap-2'>
                <div
                  className={`rounded-full text-[12px] py-[4px] px-[6px] bg-gray-200 text-gray-500 lowercase event_title`}
                >
                  {eventElement.old_value !== ""
                    ? trimmedString(eventElement.old_value)
                    : t("nobody")}
                </div>
                <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                  {" "}
                  <FaArrowRight />
                </div>
                <div
                  className={`rounded-full text-[12px] py-[4px] px-[6px] bg-gray-200 text-gray-500 lowercase event_title`}
                >
                  {trimmedString(eventElement.new_value)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const trimmedString = (text: string) => {
  return text.replace(/,\s*$/, "");
};

const priorityTexts: { [key: number]: string } = {
  1: "priority_data_1",
  2: "priority_data_2",
  3: "priority_data_3",
};

const getPriorityText = (value: number): string => {
  return priorityTexts[value] || "";
};

type IconType =
  | "status"
  | "priority"
  | "created"
  | "comment"
  | "participant"
  | "archive";

const iconMap: Record<IconType, ReactElement> = {
  status: <Loop />,
  priority: <Priority />,
  created: <PlusIcon />,
  comment: <CommentEvent />,
  participant: <UsersIcon />,
  archive: <Archive width={16} height={16} opacity={.7} />,
};

export default EventCard;
