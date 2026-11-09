import { dateTimeConverter } from "../../common/dateTimeConverter";
import { AvatarUser } from "../mini/AvatarUser";
import { Fragment } from "react/jsx-runtime";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";
import ArrowLongRight from "../../assets/icons/ArrowLongRight";
import useUserColor from "../../common/useUserColor";
import { getEventTypeMap } from "./ChangeTypeValue";
import ValueType from "./ValueType";
interface IEvent {
  changes: IEventChange[];
  user_name: string;
  user_id: number;
}

interface IEventChange {
  type: string;
  created_at: string;
  old_value: string;
  new_value: string;
}

const OnlyOne = (props: { event: IEvent }) => {
  const { color1000 } = useUserColor(props.event.user_id);

  const eventTypeMap = getEventTypeMap();

  return (
    <div className='flex flex-col justify-center'>
      <div className='flex gap-3 items-center '>
        <div className='mr-2'>
          <AvatarUser
            alt={props.event.user_name}
            id={props.event.user_id}
            width={20}
            height={20}
            textClass='text-[12px] font-sfpro font-bold'
          />
        </div>
        <p
          className='font-normal text-[15px]'
          style={{
            color: color1000,
          }}
        >
          {props.event.user_name}
        </p>
        {props.event.changes.map((change: IEventChange, index: number) => (
          <Fragment key={index}>
            <p className='font-normal text-black text-xs font-sfpro'>
              {eventTypeMap[change.type] || eventTypeMap.default}
            </p>
            <p className='font-normal text-[10px] text-customGray font-sfpro'>
              {dateTimeConverter.convertTime(change.created_at)}
            </p>
          </Fragment>
        ))}
      </div>
      {props.event.changes.map((change: IEventChange, index: number) => {
        if (change.type === "created") {
          return null;
        }
        return (
          <div
            key={index}
            className={
              change.type === "created" ? "" : "flex items-center gap-1 mt-2"
            }
          >
            {change.type === "comment" ? (
              <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl rounded-tl-none'>
                <p className='text-xs text-customPurple font-medium'>
                  {capitalizeFirstLetter(change.new_value)}
                </p>
              </div>
            ) : change.type === "archive" ? (
              <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl '>
                <p
                  className='text-xs text-customPurple lowercase event_title'
                >
                  {change.new_value}
                </p>
              </div>
            ) : (
              <>
                <div className='w-auto bg-customBlueLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                  <p
                    className='text-xs line-through text-customBlue lowercase event_title'
                  >
                    <ValueType value={change.old_value} />
                  </p>
                </div>
                <ArrowLongRight />
                <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                  <p
                    className='text-xs text-customPurple lowercase event_title'
                  >
                    <ValueType value={change.new_value} />
                  </p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OnlyOne;
