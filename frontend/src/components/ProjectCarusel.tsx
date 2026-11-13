import { useEffect, useReducer, useRef } from "react";
import "./carusel.css";
import { useSwipeable } from "react-swipeable";
import { useParams } from "react-router-dom";
import { TopProjectBar } from "./TopProjectBar";
import ProjectCaruselItem, { IProjectTaskUser } from "./ProjectCaruselItem";
import { useGetTaskHeader, useGetTasks } from "../common/fetchTasks";
import { Loader } from "./mini/Loader";
import { t } from "i18next";
import { ICommentIn } from "./Comment";
import useGetStatuses from "../data/hooks/statuses";
import clsx from "clsx";
import TasksIcon from "../assets/icons/TaskIcon";
import { UserInterface } from "../data/hooks/users/interface";

export interface Params {
  user_ids?: string;
}

interface IProjectTask {
  id: number;
  status_id: number;
  taskUser: IProjectTaskUser[];
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  priority: number;
  taskComment: ICommentIn[];
  user: UserInterface;
}

export interface IStatus {
  id: number;
  name: string;
  tasksCount: number;
  order: number;
  project_id: number;
}

export interface IState {
  statuses: IStatus[];
  index: number;
  name: string;
  users: [];
  currectUser: number;
  selector: boolean;
  selectedStatus: number | string | null;
  touchStart: number | null;
  touchEnd: number | null;
  selectedUsers: string;
}

const initialState: IState = {
  statuses: [],
  index: 0,
  name: "",
  users: [],
  currectUser: 0,
  selector: true,
  selectedStatus: null,
  touchStart: null,
  touchEnd: null,
  selectedUsers: "",
};


export const ProjectCarusel = () => {
  const { id } = useParams();
  const [state, setState] = useReducer(
    (state: IState, setState: Partial<IState>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
  } = useGetTasks(
    {
      status: state.selectedStatus,
      user_ids: state.selectedUsers,
    },
    Number(id),
  );

  const { data: project, isLoading, error } = useGetTaskHeader(Number(id));

  useEffect(() => {
    const currentHash = window.location.hash;
    const list = document.getElementById("tasks-list");
    if (!isLoadingTasks && !isFetchingTasks && currentHash) {
      const extractedId = currentHash.substring(1).split("&")[0];
      const element = document.getElementById(extractedId);
      if (element && list) {
        const offset = 105;
        const targetPosition = element.getBoundingClientRect().top - offset;
        setTimeout(() => {
          list.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 0);
      }
    }
  }, [isLoadingTasks, isFetchingTasks]);

  useEffect(() => {
    const currentHash = window.location.hash;
    const extractedStatus = currentHash.substring(1).split("&")[1];
    if (extractedStatus !== "null" && currentHash && extractedStatus) {
      setState({ selectedStatus: extractedStatus });
    } else if (state.statuses?.length) {
      setState({ selectedStatus: state.statuses[0].id });
    }
  }, [state.statuses]);

  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    if (direction === "LEFT" && state.index < state.statuses.length - 1) {
      setState({
        selectedStatus: state.statuses[state.index + 1].id,
        index: state.index + 1,
      });
      statusClicker(state.statuses[state.index + 1].id);
    } else if (direction === "RIGHT" && state.index > 0) {
      setState({
        selectedStatus: state.statuses[state.index - 1].id,
        index: state.index - 1,
      });
      statusClicker(state.statuses[state.index - 1].id);
    }
  };

  const tabContainerRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
    trackMouse: true,
  });

  useEffect(() => {
    if (project) {
      setState({ name: project.name, users: project.users });
    }
  }, [project]);

  const { data: statuses } = useGetStatuses(Number(id), state.selectedUsers, {
    onSuccess: (data: IStatus[] | undefined) => {
      setState({ statuses: data });
    },
  });

  const getStatuses = async (): Promise<void> => {
    setState({ statuses: statuses });
  };

  const updateHash = (status: number) => {
    setState({ selectedStatus: status });
    statusClicker(status);
  };

  const statusClicker = (id: number) => {
    const element = document.getElementById("status_" + id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const statusess: { [key: string]: string } = {
    "To do": "to_do",
    "In Progress": "in_progress",
    Testing: "testing",
    Completed: "completed",
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <>
      <TopProjectBar
        state={state}
        setState={setState}
        id={Number(id)}
        group_id={project?.group_id}
        group_name={project?.group?.name}
        mono_topic={project?.mono_topic}
      />
      <div
        ref={tabContainerRef}
        className="transition-all top-[56px] flex h-[44px] max-w-[700px] w-full overflow-x-scroll border-b bg-white px-2 scroll-smooth status-list fixed z-[19]"
      >
        {state.statuses &&
          Number(state.statuses?.length) > 0 &&
          state.statuses.slice(0, 4).map((status: IStatus) => (
            <div
              id={"status_" + status.id}
              key={status.id}
              className="transition-all flex h-full  items-center gap-2 px-4 relative cursor-pointer"
              onClick={() => updateHash(status.id)}
            >
              <>
                <p
                  className={`transition text-sm whitespace-nowrap ${
                    Number(state.selectedStatus) === Number(status.id)
                      ? "text-gradient-blue"
                      : "text-customBlack"
                  } font-bold font-sfpro`}
                >
                  {t(statusess[status.name])}
                </p>
                <p
                  className={clsx(
                    `transition text-[11px] font-medium rounded-3xl text-white flex items-center justify-center pt-[1px]  min-w-[18px] font-sfpro`,
                    Number(state.selectedStatus) === Number(status.id)
                      ? "bg-custom-gradient-blue"
                      : "bg-customBlack",
                    status.tasksCount <= 9
                      ? "w-5 h-5 p-0"
                      : status.tasksCount < 100
                      ? "w-6 h-5"
                      : "w-7 h-5",
                  )}
                >
                  {status.tasksCount < 100 ? status.tasksCount : "+99"}
                </p>
              </>
              {Number(state.selectedStatus) === Number(status.id) && (
                <div className="transition absolute left-0 bottom-0 h-[3px] rounded-t-full w-full border-blue-500 border bg-custom-gradient-blue"></div>
              )}
            </div>
          ))}
      </div>
      <div className="h-[44px]"></div>
      {isLoadingTasks || isFetchingTasks ? (
        <Loader customClass="h-[200px]" />
      ) : (
        <div
          {...handlers}
          id="carusel-heighter"
          className="carusel-heighter"
          style={{ touchAction: "pan-y" }}
        >
          <div
            id="tasks-list"
            key={state.index}
            className="carusel-heighter flex flex-col px-4 pb-12 items-center overflow-y-scroll"
          >
            {tasks && Number(tasks?.length) > 0 ? (
              tasks
                .slice()
                .map((task: IProjectTask, index: number) => (
                  <ProjectCaruselItem
                    getStatuses={getStatuses}
                    key={task.id}
                    project={task}
                    statuses={state.statuses}
                    setProjectState={setState}
                    selectedStatus={state.selectedStatus}
                    index={index}
                  />
                ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-16">
                <TasksIcon />
                <p className="text-13 text-customBlack font-sfpro font-medium">
                  {t("task_empty")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
