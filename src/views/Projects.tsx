import { useEffect, useState } from "react";
import { Avatar } from "../components/mini/Avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { Loader } from "../components/mini/Loader";
import { AvatarUser } from "../components/mini/AvatarUser";
import getUsersData from "../common/getUsersData";
import { t } from "i18next";
import useUserColor from "../common/useUserColor";
import EllipsisText from "../components/EllipsisText";
import clsx from "clsx";
import { useSuperGroups } from "../data/hooks/group";
import WebApp from "@twa-dev/sdk";
import { UserInterface } from "../data/hooks/users/interface";

interface IGroup {
  image: string;
  user: UserInterface;
}

interface IProject {
  id: number;
  name: string;
  tasks: [];
  topic_id: number;
}

const Projects = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [openParticipant, setOpenParticipant] = useState(false);

  const { data, error, isLoading } = useSuperGroups(Number(id));

  const getData = async () => {
    const returnGroup = await getUsersData(`${id}`);
    setGroups(returnGroup);
  };


  useEffect(() => {
    if (data) {
      getData();
    }
    if (data && data.projects?.length === 1) {
      navigate("/projects/" + data.projects[0]?.id, { replace: true, });
    }
  }, [data, navigate]);

  

  const { color } = useUserColor(Number(id));

  const getParticipantText = (count: number) => {
    if (count === 1) {
      return t("participant", { count });
    } else if (count > 1 && count < 5) {
      return t("participant_1", { count });
    } else {
      return t("participant_2", { count });
    }
  };

  if (isLoading) return <Loader />;

  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  } 

  return (
    <div>
      <nav className='fixed h-[100px] py-[12px] w-full top-0 max-w-[700px] mx-auto flex justify-between items-center px-3 z-20 bg-[#f2f2f7]'>
        <div
          className='bg-customPurple flex justify-between rounded-[20px] w-full h-full p-4'
          style={{ background: color }}
        >
          <div className='flex items-center text-gray-700 gap-2 cursor-pointer'>
            <Avatar
              image={""}
              alt={`${data.name}`}
              id={Number(id)}
              border={2}
              bgColor={
                "linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))"
              }
              borderColor='rgba(242, 242, 247, 0.5)'
              avatarClass={`w-12 h-12 rounded-xl text-xl border-2 backdrop-blur-[25px] shadow-custom60`}
            />
            <div>
              <EllipsisText
                width={"170px"}
                text={`${data.name || " "}`}
                size={24}
                textColor='white'
              />
              <p className='text-[12px] text-white font-sfpro opacity-60'>
                {getParticipantText(data.groupUsers?.length)}
              </p>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <div className={groups?.length === 0 ? `hidden` : `relative`}>
              <div
                className='absolute z-10 -top-4 right-[9px] rounded-custom-16 min-w-[60px] flex gap-4 items-center p-1 cursor-pointer'
                onClick={() => {
                  setOpenParticipant(true);
                }}
              >
                <div className='w-max flex justify-end items-end'>
                  {groups?.length > 3 ? (
                    <>
                      {groups.slice(0, 3).map((user: IGroup, index: number) => (
                        <AvatarUser
                          alt={`${user?.user?.name}` || " "}
                          width={28}
                          height={28}
                          key={index}
                          id={user?.user?.telegram_id}
                        />
                      ))}
                      <div
                        className={`mr-[-12px] w-[28px] h-[28px] min-w-[28px] min-h-[28px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                      >
                        <p className='relative top-[1px] text-[11px] font-bold font-sfpro'>
                          +{groups?.length - 3 >= 9 ? 9 : groups?.length - 3}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className='flex justify-end items-end ml-[30px]'>
                      {groups.map((user: IGroup, index: number) => (
                        <AvatarUser
                          alt={`${user?.user?.name}` || " "}
                          width={28}
                          height={28}
                          key={index}
                          id={user?.user?.telegram_id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className='h-[80px] w-full'></div>
      <div className='p-3 mt-4'>
        {data.projects?.length > 0 &&
          data.projects
            .filter((el: IProject) => el.topic_id == 1)
            .map((item: IProject) => (
              <Link
                to={"/projects/" + item.id}
                key={item.id}
                className='w-full h-[56px] px-4 flex justify-between bg-white rounded-custom-16 '
              >
                <div className='flex items-center gap-3'>
                  <Avatar
                    image={""}
                    alt={"#"}
                    id={item.id}
                    bgColor='linear-gradient(0deg, #CECECE, #CECECE),
linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))'
                    avatarClass='w-7 h-7 rounded-lg text-[12px] font-bold'
                    borderColor='rgba(255, 255, 255, .25)'
                    textClass='font-bold'
                  />
                  <p className='text-[17px] text-black font-sfpro'>
                    {item.name}
                  </p>
                </div>
                <div className='flex items-center gap-1'>
                  <div
                    className={clsx(
                      "bg-customGrey1 px-[4px] py-[2px] rounded-3xl min-w-[20px] flex items-center justify-center",
                      item.tasks?.length <= 9 && "w-5 h-5 p-0",
                    )}
                  >
                    <p className='text-[12px] font-bold font-sfpro text-white'>
                      {item.tasks?.length}
                    </p>
                  </div>
                  <div className='text-gray-300 text-lg'>
                    <FaAngleRight />
                  </div>
                </div>
              </Link>
            ))}
        <div className='bg-white rounded-xl overflow-hidden mt-[8px]'>
          <div className='flex flex-col w-full'>
            {data.projects?.length > 0 &&
              data.projects
                .filter((el: IProject) => el.topic_id != 1)
                .map((item: IProject) => (
                  <Link
                    to={"/projects/" + item.id}
                    key={item.id}
                    className='w-full h-[52px] px-4 flex justify-between bg-white'
                  >
                    <div className='flex items-center gap-3 w-[70%]'>
                      <div className='w-[13%]'>
                        <Avatar
                          image={""}
                          alt={`${item.name}`}
                          radius={8}
                          id={item.id}
                          textClass='font-medium'
                          avatarClass='w-7 h-7 rounded-lg text-[12px] '
                          borderColor='rgba(255, 255, 255, .25)'
                        />
                      </div>
                      <p className='text-[17px] text-black capitalize font-sfpro 87%'>
                        <EllipsisText text={item.name} width='160px' />
                        {/* {item.name} */}
                      </p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div
                        className={clsx(
                          "bg-blue-200 px-[4px] py-[2px] rounded-3xl min-w-[20px] flex items-center justify-center",
                          item.tasks?.length <= 9 && "w-5 h-5 p-0",
                        )}
                      >
                        <p className='text-[12px] font-bold font-sfpro text-gradient-blue'>
                          {item.tasks?.length}
                        </p>
                      </div>
                      <div className='text-gray-300 text-lg'>
                        <FaAngleRight />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
          }}
        ></div>
      )}
      <div
        className={clsx(
          openParticipant ? "bottom-3" : "bottom-[-100%]",
          "overflow-y-scroll max-h-[70%] z-[100] fixed left-3 right-3 transition-all scrollbar-hidden rounded-[25px] bg-white px-3 py-5 flex flex-col gap-2",
        )}
      >
        {groups.map((user: IGroup, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex items-center gap-4'>
              <AvatarUser
                alt={`${user.user.name}`}
                id={user?.user?.telegram_id}
                width={28}
              />
              <div className='ml-3'>
                <p className='text-[17px] font-normal text-black leading-5 font-sfpro'>
                  {user.user.name}
                </p>
                <p className='text-[14px] font-normal text-customBlack leading-3 font-sfpro'>
                  @{user.user.username}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
