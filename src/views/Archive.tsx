import { useParams } from "react-router-dom";
import ArchiveComponent, { IArchiveIn } from "../components/ArchiveComponent";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import { useGetTaskHeader } from "../common/fetchTasks";
import { Avatar } from "../components/mini/Avatar";
import { t } from "i18next";
import ArchiveIcon from "../assets/icons/Archive";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { Loader } from "../components/mini/Loader";

const getArchiveById = async (id: number) => {
  return await fetchData(`project/${id}/archive`, {});
};

const Archive = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#ffffff");
  }, []);
  const { id } = useParams();

  const { data: project, isLoading, isFetching } = useGetTaskHeader(Number(id));

  const { data: archiveById, isLoading: isLoadingArchive } = useQuery(
    ["archiveTasks", id],
    () => getArchiveById(Number(id)),
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className='h-[56px]' />
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-white shadow-custom z-50'>
        <div className='w-[60px] flex'>
          <Avatar
            image={""}
            alt={
              project.mono_topic ? project.group.name : project.name
            }
            id={project.mono_topic ? project.group_id : Number(id)}
            avatarClass='w-9 h-9 rounded-[10px]'
          />
        </div>
        <p className='font-medium text-[17px] text-customDark capitalize'>
          {t("archive_files")}
        </p>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
      </div>
      <div className='px-3 mt-2 flex flex-col gap-2'>
        {(() => {
          if (isLoadingArchive || isFetching) {
            return <Loader />;
          }

          if (archiveById.length > 0) {
            return archiveById.map((archive: IArchiveIn, index: number) => (
              <ArchiveComponent key={index} archive={archive} />
            ));
          }

          return (
            <div className='flex flex-col items-center justify-center mt-16'>
              <ArchiveIcon width={40} height={40} />
              <p className='text-13 text-customBlack font-sfpro font-medium'>
                {t("archive_empty")}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Archive;
