import { useQuery } from "react-query";
import { eventsApi } from "../../api/events";

export const useGetEventsNew = () => {
  return useQuery({
    queryKey: ["eventsNewData"],
    queryFn: eventsApi.getEvntsNew
  });
};

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["eventsNewData"],
    queryFn: eventsApi.getEvents
  });
};