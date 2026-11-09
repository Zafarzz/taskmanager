import { Link } from "react-router-dom";
import { Avatar } from "../mini/Avatar";
import EllipsisText from "../EllipsisText";
import { t } from "i18next";
import { IGroup } from "./GroupCarusels";
import useUserColor from "../../common/useUserColor";

const BigProject = (props: { project: IGroup }) => {
  const { secondary_color, color } = useUserColor(props.project.id);

  const getParticipantText = (count: number) => {
    if (count === 1) {
      return t("participant", { count });
    } else if (count > 1 && count < 5) {
      return t("participant_1", { count });
    } else {
      return t("participant_2", { count });
    }
  };

  return (
    <div
      className='w-auto relative border-2 rounded-custom-16 h-[150px] min-w-[230px] shadow-custom510 overflow-hidden'
      style={{
        borderColor: secondary_color,
      }}
    >
      <Link
        to={"/groups/" + props.project.id}
        className={`h-full w-full p-4 flex flex-col justify-between flex-1`}
        style={{
          background: color,
        }}
      >
        <div>
          <div className='flex justify-between'>
            <div className='flex gap-[8px]'>
              <Avatar
                image={""}
                alt={props.project.name}
                id={props.project.id}
                bgColor={
                  "linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))"
                }
                borderColor='rgba(255, 255, 255, 0.12)'
                avatarClass='w-9 h-9 rounded-lg'
              />
              <div className='' style={{ color: `rgba(255, 255, 255, 1)` }}>
                <EllipsisText text={props.project.name} width='150px' />
                <p className='text-[12px] font-normal leading-3	text-customWhite1 font-sfpro'>
                  {getParticipantText(props.project.users?.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between bg-customWhite rounded-[10px] h-[45px] p-[12px] border border-customGrey3'>
          <p className='text-[15px] text-white font-medium font-sfpro'>
            {t("active_tasks")}
          </p>
          <p className='text-[15px] text-white font-semibold font-sfpro'>
            {props.project.tasks}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BigProject;
