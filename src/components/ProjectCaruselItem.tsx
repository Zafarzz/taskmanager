import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AvatarUser } from "./mini/AvatarUser";
import { useReducer } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import StatusSelector from "./StatusSelector";
import Comment from "../assets/icons/Comment";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { useUserContext } from "../context/UserContext";
import { ICommentIn } from "./Comment";
import { IState, IStatus } from "./ProjectCarusel";
import { useUpdateStatus } from "../data/hooks/tasks";
import PrioritetHigh from "../assets/icons/PrioritetHigh";
import PrioritetLow from "../assets/icons/PrioritetLow";
import PrioritetMedium from "../assets/icons/PrioritetMedium";
import { UserInterface } from "../data/hooks/users/interface";

interface IStateItem {
  userPhoto: string;
  selectStatus: number | string | null;
  participants: IParticipant[];
}

const initialState: IStateItem = {
  userPhoto: "",
  selectStatus: null,
  participants: [],
};

interface IProps {
  project: IProject;
  statuses: IStatus[];
  setProjectState: React.Dispatch<Partial<IState>>;
  getStatuses: () => Promise<void>;
  selectedStatus: number | string | null;
  index: number;
}

interface IProject {
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

export interface IProjectTaskUser {
  task_id: number;
  user: UserInterface;
  user_id: string;
}

interface IParticipant {
  img?: string;
  user: UserInterface;
  task_id: number;
  user_id: number | string;
}

const ProjectCaruselItem = (props: IProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { project, statuses, setProjectState, getStatuses, selectedStatus } =
    props;

  const [state, setState] = useReducer(
    (state: IStateItem, setState: Partial<IStateItem>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const { mutate: updateStatus } = useUpdateStatus(Number(project?.id));

  const handleStatusUpdate = async (newStatus: number): Promise<void> => {
    updateStatus(newStatus);
    setProjectState({ selectedStatus: project.status_id });
    getStatuses();
  };

  const locationNavigator = () => {
    navigate("#" + project.id + "&" + selectedStatus, { replace: true });
    navigate("/tasks/" + project.id);
  };

  return (
    <>
      <div
        id={`${project.id}`}
        className='task-carusel-item w-full mt-2 relative'
      >
        <p
          className='absolute z-10 right-4 top-[12px] text-2xl text-gray-400'
          onClick={() => setState({ selectStatus: project.status_id })}
        >
          <HiOutlineDotsHorizontal />
        </p>
        <div
          onClick={locationNavigator}
          key={project.id}
          className='block bg-white rounded-custom-16 px-4 py-3 w-full'
        >
          <div className='flex justify-between items-center mb-2 relative'>
            <p className='text[17px] text-customDark1 max-w-[90%] font-[500] single-line-ellipsis font-sfpro'>
              {capitalizeFirstLetter(project.name)}
            </p>
          </div>
          <p className='text-sm text-customBlack font-normal duo-line-ellipsis font-sfpro'>
            {project.description}
          </p>
          <div className='flex justify-between items-center mt-3'>
            <div className='flex gap-2 items-center'>
              <p className='font-sfpro text-13 font-medium text-customBlack'>
                {dateTimeConverter.convertTime(project.created_at)}
              </p>
              <div className='flex gap-[1px] items-end justify-center pb-1 relative top-[2px]'>
                {project.priority === 1 && <PrioritetLow />}
                {project.priority === 2 && <PrioritetMedium />}
                {project.priority === 3 && <PrioritetHigh />}
              </div>
            </div>
            <div className='flex justify-between items-center gap-3 relative right-[11px]'>
              {project.taskComment?.length !== 0 && (
                <div className='text-customBlack text-[13px] flex items-center gap-1'>
                  <Comment />
                  <p className='mt-[2px]'>{project.taskComment?.length}</p>
                </div>
              )}
              <div className='text-blue-500 pr-1 flex'>
                {project.taskUser.length ? (
                  project.taskUser.map((taskUser: IParticipant) => (
                    <AvatarUser
                      alt={`${taskUser.user.name || ""}`}
                      width={28}
                      height={28}
                      key={taskUser.user_id}
                      shadow={true}
                      id={Number(taskUser.user_id) || 0}
                    />
                  ))
                ) : (
                  <AvatarUser
                    alt={`${project?.user?.name || user.first_name}`}
                    width={28}
                    height={28}
                    shadow={true}
                    id={project?.user?.telegram_id || 0}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusSelector
        selectStatus={state.selectStatus}
        setSelectStatus={setState}
        statuses={statuses}
        handleStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

export default ProjectCaruselItem;
