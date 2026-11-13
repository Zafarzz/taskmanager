import { useEffect, useReducer, useRef, useState } from "react";
import "../components/carusel.css";
import { useSwipeable } from "react-swipeable";
import MyTask, { IProject } from "../components/MyTask";
import axiosClient from "../common/axiosClient";
import ArrowRight from "../assets/icons/ArrowRight";
import SymbolBorder from "../assets/icons/SymbolBorder";
import { Avatar } from "../components/mini/Avatar";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";
import { useGroups } from "../data/hooks/group";
import { useQuery } from "react-query";
import clsx from "clsx";
import { Loader } from "../components/mini/Loader";
import WebApp from "@twa-dev/sdk";
import { UserInterface } from "../data/hooks/users/interface";

interface IMyTasksState {
  statuses: IStatus[];
  tasks: IProject[];
  index: number;
  name: string;
  users: UserInterface[];
  currectUser: number;
  selector: boolean;
  mytasks: boolean;
  selectedStatus: number | string | null;
}

const initialState: IMyTasksState = {
  statuses: [],
  tasks: [],
  index: 0,
  name: "",
  users: [],
  currectUser: 0,
  selector: true,
  mytasks: true,
  selectedStatus: null,
};

interface IStatus {
  id: number;
  name: string;
  count: number;
}

interface IGroup {
  id: number;
  name: string;
  is_selected: boolean;
  projects: IGroupProject[];
}

interface IGroupProject {
  id: number;
  name: string;
}

const Mytasks = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#ffffff");
  }, []);

  const [isOpenProjectFilter, setIsOpenProjectFilter] = useState(false);
  const [isOpenProject, setIsOpenProject] = useState<number>();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState<IGroupProject>();

  const handleOpenProject = (id: number) => {
    setIsOpenProject(id);
    if (isOpenProject === id) {
      setIsOpenProject(0);
    }
  };

  const { data: groups } = useGroups();

  const [state, setState] = useReducer(
    (state: IMyTasksState, setState: Partial<IMyTasksState>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    if (direction === "LEFT" && state.index < state.statuses.length - 1) {
      const newIndex = state.index + 1;
      setState({ index: newIndex });
      getTasks(state.statuses[newIndex].name);
      statusClicker(state.statuses[newIndex].id);
    } else if (direction === "RIGHT" && state.index > 0) {
      const newIndex = state.index - 1;
      setState({ index: newIndex });
      getTasks(state.statuses[newIndex].name);
      statusClicker(state.statuses[newIndex].id);
    }
  };

  const tabContainerRef = useRef(null);

  const statusClicker = (id: number) => {
    const element = document.getElementById("status_" + id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleSwipe("LEFT");
    },
    onSwipedRight: () => {
      handleSwipe("RIGHT");
    },
    trackMouse: true,
  });

  const fetchStatuses = async () => {
    const response = await axiosClient.get(
      `/user/tasks/header?project_id=${selectedProject?.id || ""}`,
    );
    return response.data;
  };

  const { data: statuses } = useQuery(
    ["statuses", selectedProject?.id],
    fetchStatuses,
    {
      enabled: true,
    },
  );

  useEffect(() => {
    if (statuses) {
      setState({
        statuses,
        selectedStatus: statuses[0]?.name || "",
        name: t("my_tasks"),
      });

      if (statuses.length > 0) {
        getTasks(statuses[0].name);
      }
    }
  }, [statuses]);

  const [isLoading, setIsLoading] = useState(false);

  const getTasks = async (statusName: string) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(
        `/user/tasks?status=${statusName}&project_id=${selectedProject?.id}`,
      );
      if (response && response.data) {
        setState({ tasks: response.data });
      } else {
        setState({ tasks: [] });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setState({ tasks: [] });
    }
  };

  useEffect(() => {
    const currentHash = window.location.hash;
    const extractedStatus = currentHash.substring(1).split("&")[1];
    if (extractedStatus !== "null" && currentHash && extractedStatus) {
      setState({ selectedStatus: extractedStatus });
    } else if (state.statuses.length) {
      setState({ selectedStatus: state.statuses[0].id });
    }
  }, [state.statuses]);

  const updateHash = (status: number) => {
    setState({ selectedStatus: status });
    statusClicker(status);
  };

  const statusess: { [key: string]: string } = {
    "To do": "to_do",
    "In Progress": "in_progress",
    Testing: "testing",
    Completed: "completed",
  };

  return (
    <>
      <div className='h-[72px]'></div>
      <div
        ref={tabContainerRef}
        className='w-full h-[72px] fixed z-10 top-0 flex justify-between items-center py-[4px] px-4 bg-white'
      >
        <div className='flex items-center gap-4'>
          <SymbolBorder />
          <div>
            <p className='text-[17px] font-medium text-black leading-5 font-sfpro'>
              {t("my_tasks")}
            </p>
          </div>
        </div>
        <div
          className='flex items-center border border-[#E1E8F5] rounded-[25px] p-[4px] pl-[10px] pr-[7px] gap-[6px] cursor-pointer'
          onClick={() => setIsOpenProjectFilter(true)}
        >
          <p className='text-[14px] font-[300] text-customBlack font-sfpro'>
            {selectedProject
              ? selectedProject?.name
              : capitalizeFirstLetter(t("project"))}
          </p>
          <div className={"rotate-90"}>
            <ArrowRight />
          </div>
        </div>
      </div>
      <div>
        {state.statuses.length > 0 && (
          <div
            ref={tabContainerRef}
            className='flex h-[44px] w-full overflow-x-scroll border-b bg-white px-2 scroll-smooth status-list fixed top-[65px] z-10'
          >
            {state.statuses.map((status: IStatus, index: number) => (
              <div
                id={"status_" + status.id}
                key={index}
                className={`flex h-full  items-center gap-2 px-4 relative cursor-pointer`}
                onClick={() => {
                  setState({ index });
                  getTasks(status.name);
                  updateHash(status.id);
                }}
              >
                <>
                  <p
                    className={`transition text-sm whitespace-nowrap ${
                      state.index === index
                        ? "text-gradient-blue"
                        : "text-customBlack"
                    } font-bold font-sfpro`}
                  >
                    {t(statusess[status.name])}
                  </p>
                  <p
                    className={clsx(
                      `transition text-[11px] font-medium rounded-3xl ${
                        state.index === index
                          ? "bg-custom-gradient-blue"
                          : "bg-customBlack"
                      } text-white flex items-center justify-center pt-[1px]  min-w-[18px] font-sfpro`,
                      status.count <= 9 ? "w-5 h-5 p-0" : "w-6 h-5 p-0",
                    )}
                  >
                    {status.count}
                  </p>
                  {state.index === index && (
                    <div className='transition absolute left-0 bottom-0 h-[3px] rounded-t-full w-full border-blue-500 border bg-custom-gradient-blue'></div>
                  )}
                </>
              </div>
            ))}
          </div>
        )}
        <div className='h-[44px]'></div>
        <div
          {...handlers}
          className='carusel-heighter'
          style={{ touchAction: "pan-y" }}
        >
          <div className='flex flex-col px-4 pb-12 items-center justify-start'>
            {isLoading && <Loader customClass="h-[100px]" />}
            {state.tasks.length > 0 ? !isLoading && (
              state.tasks
                .slice()
                .reverse()
                .map((task: IProject) => (
                  <MyTask key={task?.id} project={task} />
                ))
            ) : !isLoading && (
              <div className='mt-5 text-gray-400'>{t("no_task_yet")}</div>
            )}
          </div>
        </div>
      </div>
      {isOpenProjectFilter && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setIsOpenProjectFilter(false)}
        ></div>
      )}
      <div
        className={`${
          isOpenProjectFilter ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll scrollbar-hidden max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white p-3 mb-2 left-3 right-3 flex flex-col gap-2`}
      >
        {groups?.map((group: IGroup, index: number) => (
          <div
            onClick={() => {
              handleOpenProject(group?.id);
            }}
            key={index}
            className={`${
              isOpenProject === group?.id
                ? "bg-[#FAFAFA] border-[1px] border-[#EBEDF0]"
                : "border border-[white]"
            }  pt-[6px] pb-[6px] rounded-xl flex flex-col justify-between relative transition-all duration-700 ease-in-out`}
          >
            <div className='w-full px-[18px] h-[44px] flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Avatar
                  image={""}
                  alt={group.name}
                  id={group.id}
                  avatarClass='w-7 h-7 rounded-md'
                />
                <p className='font-normal text-[17px] text-black font-sfpro'>
                  {group.name}
                </p>
              </div>
              <div
                className={`${
                  isOpenProject === group?.id
                    ? "rotate-[270deg]"
                    : "rotate-[90deg]"
                }`}
              >
                <ArrowRight />
              </div>
            </div>
            <div className='flex w-full'>
              <div className='w-[3px] h-auto bg-customBlack1 relative left-[30px] rounded-full'></div>
              {isOpenProject === group?.id ? (
                <div className='ml-[35px] px-[18px] max-h-[200px] opacity-100 w-full overflow-scroll'>
                  {group.projects?.map((project: IGroupProject, i: number) => (
                    <div
                      onClick={() => {
                        setSelectedProjectId(project.id.toString());
                        setSelectedProject(project);
                        setIsOpenProjectFilter(false);
                      }}
                      key={i}
                      className='flex items-center justify-between h-[44px] transition-all duration-500 ease-in-out cursor-pointer'
                    >
                      <p className='font-normal text-[17px] text-black font-sfpro'>
                        {capitalizeFirstLetter(project?.name)}
                      </p>
                      <div
                        className={`${
                          project.id.toString() === selectedProjectId
                            ? "border-blue-500"
                            : "border-gray-400"
                        } flex justify-center items-center rounded border w-4 h-4`}
                      >
                        {project.id.toString() === selectedProjectId && (
                          <div className='bg-blue-500 w-[10px] h-[10px] rounded-sm'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='ml-[35px] transition-all duration-700 ease-in-out max-h-0 opacity-0 overflow-hidden'></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Mytasks;
