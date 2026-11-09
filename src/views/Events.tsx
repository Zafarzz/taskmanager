import { Fragment, useEffect } from "react";
import EventPromo, { IEventGroup } from "../components/event_promo/EventPromo";
import { t } from "i18next";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { useGetEvents } from "../data/hooks/events";
import { Loader } from "../components/mini/Loader";
import WebApp from "@twa-dev/sdk";

interface IEvent {
  date: string;
  tasks: IEventGroup[];
}

const Events = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#ffffff");
  }, []);

  const { data, isLoading, isFetching } = useGetEvents();

  if (isLoading || isFetching) {
    return <Loader customClass="h-[100vh]" />;
  }

  return (
    <div className="px-3">
      <div className="h-[56px]" />
      <div className="fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-white shadow-custom z-50">
        <div className="text-gray-500 h-full w-[60px] flex items-center"></div>
        <p className="font-medium text-[17px] text-customDark capitalize font-sfpro">
          {t("events")}
        </p>
        <div className="w-[60px] h-full flex justify-end items-center"></div>
      </div>
      <div className="flex flex-col gap-[7px] mt-3">
        <>
          {isLoading && <Loader customClass="h-[90vh]" />}
          {data?.length !== 0
            ? !isLoading &&
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
            : !isLoading && (
                <div className="w-full flex justify-center mt-10">
                  <p className="capitalize font-medium text-[15px] text-customBlack font-sfpro">
                    {t("no_events")}
                  </p>
                </div>
              )}
        </>
      </div>
    </div>
  );
};

export default Events;
