import { t } from "i18next";
import ArrowRight from "../../assets/icons/ArrowRight";
import Clock from "../../assets/icons/Clock";
import { useRef } from "react";

const Deadline = ({deadline, setDeadline}: {deadline: string, setDeadline: (value: string) => void}) => {
  const dateRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className='relative'
      onClick={() => {
        dateRef?.current?.showPicker();
      }}
    >
      <label className='h-[44px] flex justify-between items-center px-4 cursor-pointer'>
        <div className='flex justify-between items-center gap-2'>
          <div className='text-gray-400'>
            <Clock />
          </div>
          <p className='text-black text-base font-normal capitalize font-sfpro'>
            {t("deadline")}
          </p>
        </div>
        <div className='flex items-center gap-1 text-gray-400'>
          <p className='font-normal text-base text-customBlack mr-[-10px] font-sfpro'>
            {deadline ? deadline : t("choose_date")}
          </p>
          <div className='ml-3'>
            <ArrowRight />
          </div>
        </div>
      </label>

      {/* Input for date selection */}
      <input
        ref={dateRef}
        type='date'
        className='absolute right-[70px] top-2 opacity-[0] cursor-pointer scale-[1.6] bg-cyan-950'
        onChange={(e) => setDeadline(e.target.value)}
      />
    </div>
  );
};

export default Deadline;
