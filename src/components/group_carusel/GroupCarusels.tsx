import { useQuery } from "react-query";
import { fetchData } from "../../common/fetchData";
import { Link } from "react-router-dom";
import projectplus from "../../assets/images/projectplus.svg";
import { t } from "i18next";
import BigProject from "./GroupCarusel";
import { Loader } from "../mini/Loader";
import { UserInterface } from "../../data/hooks/users/interface";

const getGroups = async () => {
  return await fetchData("/group/selected", {});
};

export interface IGroup {
  id: number;
  name: string;
  groupUsers: UserInterface[];
  users: UserInterface[];
  tasks: number;
}


const BigProjects = () => {
  const { data, error, isLoading } = useQuery(["groupSelect"], () => getGroups());  

  if (isLoading) return <Loader customClass="h-[170px]" />;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className='mt-3'>
      <div className='px-3 flex items-center justify-between'>
        <p className='font-normal text-[13px] text-customGrayDark uppercase font-sfpro'>
          {t("projects")}
        </p>
        <Link
          to={"/settingsprojects"}
          className='text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro'
        >
          {t("setup")}
        </Link>
      </div>
      {data?.length === 0 && (
        <>
          <div className='flex flex-col justify-center items-center text-customGrayDark text-base mt-10'>
            <p className='text-customGrayDark text-base font-sfpro'>
              <img src={projectplus} alt='projectplus' />
            </p>
            <Link
              to={"/settingsprojects"}
              className='text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro'
            >
              {t("show_projects")}
            </Link>
          </div>
        </>
      )}
      <div className='flex gap-[8px] overflow-x-scroll scrollbar-hidden px-3 py-2'>
        {data?.map((project: IGroup, index: number) => (
          <BigProject key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default BigProjects;