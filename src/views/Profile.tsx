import { AvatarUser } from "../components/mini/AvatarUser";
import ArrowRight from "../assets/icons/ArrowRight";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const Profile = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
  }, []);
  const { user } = useUserContext();

  return (
    <div className='px-3 mt-2 flex flex-col gap-[32px]'>
      <div className='w-full h-[103px] flex flex-col items-center justify-center py-[4px]'>
        <div>
          <AvatarUser
            mr={true}
            width={48}
            height={48}
            alt={user.first_name}
            id={user.telegram_id}
          />
        </div>
        <p className='font-medium text-[20px] text-customBlackLight leading-[24px] font-sfpro'>
          {user && user.first_name}
        </p>
        <p className='font-normal text-[14px] text-customBlack1 font-sfpro'>
          @{user && user.username}
        </p>
      </div>
      <div className='flex flex-col gap-[12px]'>
        <Link
          to={"/language"}
          className='w-full h-[48px] flex items-center justify-between px-4 bg-white rounded-[12px]'
        >
          <p className='text-[17px] font-normal text-black font-sfpro'>
            {t("settings")}
          </p>
          <ArrowRight />
        </Link>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-4 bg-white '>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              {t("documentation")}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-4 bg-white rounded-[12px]'>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              {t("support")}
            </p>
            <ArrowRight />
          </div>
        </div>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-4 bg-white '>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              {t("user_agreement")}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-4 bg-white rounded-[12px]'>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              {t("privacy_policy")}
            </p>
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
