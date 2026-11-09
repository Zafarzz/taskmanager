import { Link } from "react-router-dom";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { Avatar } from "./mini/Avatar";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import clsx from "clsx";
import PrioritetLow from "../assets/icons/PrioritetLow";
import PrioritetHigh from "../assets/icons/PrioritetHigh";
import PrioritetMedium from "../assets/icons/PrioritetMedium";

interface IProjectProps {
  project: IProject;
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  created_at: string;
  priority: number;
  project: IProjectIn;
}

interface IProjectIn {
  id: number;
  name: string;
}

const ProjectCaruselItem = (props: IProjectProps) => {
  const { project } = props;
  
  return (
    <>
      <div className='w-full mt-2 relative'>
        <Link
          to={"/tasks/" + project.id}
          key={project.id}
          className='block bg-white rounded-custom-16 p-4 py-3 w-full'
        >
          <div className='flex justify-between items-center mb-2 relative'>
            <p
              className='text[17px] text-customDark1 font-[500] single-line-ellipsis font-sfpro'
            >
              {capitalizeFirstLetter(project.name)}
            </p>
          </div>
          <p
            className='text-sm text-customBlack font-normal duo-line-ellipsis font-sfpro'
          >
            {project.description}
          </p>
          <div className={clsx('flex justify-between items-center mt-3', project.description?.length === 0 && "mt-0")}>
            <div className='flex gap-2 items-center'>
              <p className='font-sfpro text-13 font-medium text-customBlack'>
                {dateTimeConverter.convertTime(project.created_at)}
              </p>
              <div className='flex gap-[1px] items-end justify-center pb-1'>
                {project.priority === 1 && <PrioritetLow />}
                {project.priority === 2 && <PrioritetMedium />}
                {project.priority === 3 && <PrioritetHigh />}
              </div>
            </div>
            <div className='flex justify-between items-center gap-3 relative'>
              <p className='text-sm text-customBlack font-sfpro'>
                {capitalizeFirstLetter(project?.project?.name)}
              </p>
              <div className='text-blue-500'>
                <Avatar
                  image={""}
                  alt={project?.project?.name}
                  id={project?.project?.id}
                  avatarClass="w-7 h-7 rounded-lg"
                  textClass="text-[12px] font-bold"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ProjectCaruselItem;
