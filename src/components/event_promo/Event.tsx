import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";
import { dateTimeConverter } from "../../common/dateTimeConverter";
import { AvatarUser } from "../mini/AvatarUser";
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

const Event = (props: { event: IEvent; color: string }) => {
  const { color1000 } = useUserColor(props.event.user_id);
  const eventTypeMap = getEventTypeMap();

  return (
    <div className='mt-3'>
      <div className='flex gap-3 items-center'>
        <div className='mr-2'>
          <AvatarUser
            alt={props.event.user_name}
            width={20}
            height={20}
            size={14}
            id={props.event.user_id}
            textClass='text-[12px] font-sfpro font-bold'
          />
        </div>
        <p
          className='font-normal text-[15px] font-sfpro'
          style={{
            color: color1000,
          }}
        >
          {props.event.user_name}
        </p>
      </div>
      <div className='flex gap-2 mt-1'>
        <div
          className='w-[3px] h-auto rounded-full ml-2 text-transparent'
          style={{ backgroundColor: props.color }}
        >
          .
        </div>
        <div className='p-2 flex flex-col gap-3'>
          {props.event.changes.map((change: IEventChange, index: number) => (
            <div key={index} className='flex flex-col gap-2'>
              <div className='flex gap-3 items-center'>
                <p className='font-normal text-black text-xs font-sfpro'>
                  {eventTypeMap[change.type] || eventTypeMap.default}
                </p>
                <p className='font-normal text-[10px] text-customGray font-sfpro'>
                  {dateTimeConverter.convertTime(change.created_at)}
                </p>
              </div>
              <div className='flex items-center gap-1 flex-wrap'>
                {change.type === "created" ? (
                  ""
                ) : change.type === "comment" ? (
                  <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                    <p className='text-xs text-customPurple font-medium'>
                      {capitalizeFirstLetter(change.new_value)}
                    </p>
                  </div>
                ) : change.type === "archive" ? (
                  <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                    <p
                      className='text-xs text-customPurple lowercase font-medium event_title'
                    >
                      {change.new_value}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='w-auto bg-customBlueLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                      <p
                        className='text-xs line-through text-customBlue lowercase font-medium event_title'
                      >
                        <ValueType value={change.old_value} />
                      </p>
                    </div>
                    <ArrowLongRight />
                    <div className='w-auto bg-customIndigoLight flex justify-center items-center py-[2px] px-[6px] rounded-2xl'>
                      <p
                        className='text-xs text-customPurple lowercase font-medium event_title'
                      >
                        <ValueType value={change.new_value} />
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
