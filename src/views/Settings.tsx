import ArrowRight from "../assets/icons/ArrowRight";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const Settings = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
  }, [])
  return (
    <div className='px-3 mt-2'>
      <div className='h-[40px] w-full px-4 py-[11px]'>
        <p className='text-[13px] text-customGrayDark font-sfpro'>
          {t("app_settings")}
        </p>
      </div>
      <div className='bg-white rounded-[12px] overflow-hidden'>
        <Link
          to={"/language"}
          className='w-full h-[48px] flex items-center justify-between px-4 bg-white'
        >
          <p className='text-[17px] font-normal text-black font-sfpro'>
            {t("app_language")}
          </p>
          <ArrowRight />
        </Link>
        {/* <Link to={"/timezone"} className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
          <p
            className='text-[17px] font-normal text-black font-sfpro'
          >
            {t('time_zone}
          </p>
          <ArrowRight />
        </Link> */}
      </div>
    </div>
  );
};

export default Settings;
