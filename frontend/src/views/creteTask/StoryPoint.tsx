import { t } from "i18next";
import Calendar from "../../assets/icons/Calendar";
import { useState } from "react";
import ArrowRight from "../../assets/icons/ArrowRight";

interface IStoryPoint {
  storyPoint: number,
  setStoryPoint: (storyPoint: number) => void,
}

const StoryPoint = ({
  storyPoint,
  setStoryPoint,
}: IStoryPoint) => {
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [openStoryPoint, setOpenStoryPoint] = useState(false);
  const [focusStoryPoint, setFocusStoryPoint] = useState(false);


  return (
    <>
      <div
        className='h-[44px] flex justify-between items-center px-4'
        onClick={() => setOpenStoryPoint(true)}
      >
        <div className='flex justify-between items-center gap-2'>
          <div className='flex gap-[1px] items-end justify-center text-gray-400'>
            <Calendar />
          </div>
          <p
            className='text-black text-base font-normal capitalize font-sfpro'
          >
            {t("story_point")}
          </p>
        </div>
        <div className='flex items-center gap-1 text-gray-400'>
          {!selectStoryPoint ? (
            <p
              className='font-normal text-base text-customBlack font-sfpro'
            >
              0
            </p>
          ) : (
            <p className='font-normal text-base font-sans text-black'>
              {selectStoryPoint}
            </p>
          )}
          <ArrowRight />
        </div>
      </div>
      {openStoryPoint && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full'
          onClick={() => {
            setOpenStoryPoint(false);
            setFocusStoryPoint(false);
          }}
        ></div>
      )}
      <div
        className={`${
          openStoryPoint
            ? focusStoryPoint
              ? "bottom-[30%]"
              : "bottom-3"
            : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 pb-[80px] right-3 flex flex-wrap gap-2 justify-between`}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-custom-16'>
          <input
            type='number'
            placeholder='0'
            className='w-full h-full bg-transparent outline-none border-none'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStoryPoint(Number(e.target.value))
            }
            onFocus={() => setFocusStoryPoint(true)}
          />
        </div>
        <div>
          {openStoryPoint && (
            <div
              className=' absolute bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => {
                setFocusStoryPoint(false);
                setSelectStoryPoint(storyPoint);
                setOpenStoryPoint(false);
              }}
            >
              {t("save")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryPoint;
