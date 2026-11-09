import ArrowRight from "../../assets/icons/ArrowRight";
import { useState } from "react";
import useUserColor from "../../common/useUserColor";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";
import { Link } from "react-router-dom";
import { t } from "i18next";
import OnlyOne from "./OnlyOne";
import OnlyOneChange from "./OnlyOneChange";
import Event from "./Event";
import "./event_promo.css"

interface IEventProps {
  group: IEventGroup;
}

export interface IEventGroup {
  events: IEvent[];
  task_id: number;
  project: string;
  task_name: string;
  group: string;
  project_id: number;
}

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

const EventPromo = (props: IEventProps) => {
  const [isOpenDescription, setisOpenDescription] = useState<boolean>(false);

  const changes = props.group?.events?.flatMap((el: IEvent) => el.changes);

  // if topic_id == 1 need group_id
  const ID = true ? props.group?.project_id : 1;

  const { color1000, color80, color250 } = useUserColor(ID);

  return (
    <div className='h-auto bg-white rounded-2xl p-3'>
      <Link to={"/tasks/" + props.group.task_id}>
        <p
          className=' text-xs font-medium font-sfpro'
          style={{
            color: color1000,
          }}
        >
          {props.group.group} | {props.group.project}
        </p>
        <p className='font-medium text-base leading-5 mt-1 duo-line-ellipsis font-sfpro'>
          {capitalizeFirstLetter(props.group.task_name)}
        </p>
      </Link>
      <div
        className='bg-customIndigo120 h-auto rounded-xl border-l-[3px] border-customIndigo100 p-3 mt-1'
        style={{
          background: color80,
          borderColor: color1000,
        }}
      >
        {props.group.events.map((event: IEvent, index: number) => {
          if (props.group.events.length === 1 && event.changes.length === 1) {
            return <OnlyOne key={index} event={event} />;
          }
        })}
        {changes.length > 1 && (
          <div
            className='h-5 flex justify-between items-center cursor-pointer'
            onClick={() => setisOpenDescription(!isOpenDescription)}
          >
            <p
              className='font-medium text-[13px] text-customIndigo100 font-sfpro'
              style={{
                color: color1000,
              }}
            >
              {t("recent_events")}
            </p>

            <div
              className={`${
                !isOpenDescription ? "rotate-90" : "rotate-[-90deg]"
              } duration-300 transition-all`}
            >
              <ArrowRight stroke={color1000} opacity={1} />
            </div>
          </div>
        )}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out scrollbar-hidden ${
            isOpenDescription ? "max-h-[350px] overflow-y-auto" : "max-h-0"
          }`}
        >
          <div className='mt-3'>
            {props.group.events.map((event: IEvent, index: number) => (
              <div key={index}>
                {event.changes.length === 1 ? (
                  <OnlyOneChange event={event} />
                ) : (
                  <Event event={event} color={color250} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPromo;
