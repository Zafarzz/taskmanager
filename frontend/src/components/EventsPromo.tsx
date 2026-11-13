import { Link } from "react-router-dom";
import EventPromo, { IEventGroup } from "./event_promo/EventPromo";
import { t } from "i18next";
import { Fragment } from "react/jsx-runtime";
import { dateTimeConverter } from "../common/dateTimeConverter";
import calendar from "../assets/images/calendar.svg";
import { useGetEventsNew } from "../data/hooks/events";
import { Loader } from "./mini/Loader";

interface IEvent {
  date: string;
  tasks: IEventGroup[];
}

const EventsPromo = () => {
  const { data, isFetching } = useGetEventsNew();

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[13px] font-normal text_gray uppercase font-sfpro">
          {t("events")}
        </p>
        <Link
          to={"/event"}
          className="text-gradient-blue text-[15px] font-normal font-sfpro"
        >
          {t("view_all")}
        </Link>
      </div>
      <>
        {data?.length !== 0 ? (
          data?.map((group: IEvent, index: number) => (
            <Fragment key={index}>
              <p className="capitalize font-medium text-[15px] text-customBlack font-sfpro">
                {dateTimeConverter.convertDay(group.date)}
              </p>
              {group.tasks.map((task: IEventGroup, index: number) => (
                <EventPromo key={index} group={task} />
              ))}
            </Fragment>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img src={calendar} alt="calendar" />
            <p className="text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro">
              {t("no_new_events")}
            </p>
          </div>
        )}
      </>
    </div>
  );
};

export default EventsPromo;
