import { useEffect, useState } from "react";
import { Symbol } from "../assets/icons/Symbol";
import { BiSearch } from "react-icons/bi";
import { t } from "i18next";
import WebApp from "@twa-dev/sdk";

const TimeZone = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
  }, [])
  const [isSelect, setIsSelect] = useState({
    Tash: true,
    Ash: false,
    Lon: false,
  });

  const handleTimeZoneChange = (timezone: string) => {
    setIsSelect(() => ({
      Tash: timezone === "Tash" ? true : false,
      Ash: timezone === "Ash" ? true : false,
      Lon: timezone === "Lon" ? true : false,
    }));
  };

  return (
    <div className='px-3 my-2'>
      <div className='w-full h-[36px] bg-customGray2 rounded-[10px] flex items-center px-[8px]'>
        <div>
          <BiSearch />
        </div>
        <input
          type='text'
          placeholder={t("search")}
          className='outline-none border-none pl-[4px]'
          style={{ flex: 1, background: "transparent" }}
        />
      </div>
      <div className='h-[40px] w-full px-4py-[11px] flex justify-between'>
        <p className='text-[13px] text-customGrayDark font-sfpro'>
          {t("app_language")}
        </p>
        <p className='text-[13px] text-customBlue font-sfpro'>{t("default")}</p>
      </div>
      <div>
        <div className='bg-white rounded-xl py-2'>
          <label className='flex justify-between px-4 py-2 items-center'>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              Tashkent
            </p>
            <input
              type='radio'
              name='timezone'
              value='Tash'
              className='hidden peer'
              checked={isSelect.Tash}
              onChange={() => handleTimeZoneChange("Tash")}
            />
            <div className='flex gap-[8px]'>
              <p className='text-[17px] font-normal text-black font-sfpro'>
                +5:00
              </p>
              <div className={`${isSelect.Lon ? "flex" : "hidden"}`}>
                <Symbol />
              </div>
            </div>
          </label>
          <label className='flex justify-between px-4 py-2 items-center'>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              Ashgabat
            </p>
            <input
              type='radio'
              name='timezone'
              value='Ash'
              className='hidden peer'
              checked={isSelect.Ash}
              onChange={() => handleTimeZoneChange("Ash")}
            />
            <div className='flex gap-[8px]'>
              <p className='text-[17px] font-normal text-black font-sfpro'>
                +5:00
              </p>
              <div className={`${isSelect.Lon ? "flex" : "hidden"}`}>
                <Symbol />
              </div>
            </div>
          </label>
          <label className='flex justify-between px-4 py-2 items-center'>
            <p className='text-[17px] font-normal text-black font-sfpro'>
              London
            </p>
            <input
              type='radio'
              name='timezone'
              value='Lon'
              className='hidden peer'
              checked={isSelect.Lon}
              onChange={() => handleTimeZoneChange("Lon")}
            />
            <div className='flex gap-[8px]'>
              <p className='text-[17px] font-normal text-black font-sfpro'>
                +5:00
              </p>
              <div className={`${isSelect.Lon ? "flex" : "hidden"}`}>
                <Symbol />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TimeZone;
