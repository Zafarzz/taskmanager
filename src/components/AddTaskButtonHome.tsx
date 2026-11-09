import { Link } from "react-router-dom";
import Question from "../assets/icons/Question";

export const AddTaskButtonHome = () => {
  return (
    <>
      <Link
        to={"/onboarding"}
        className='w-[64px] h-[64px] rounded-full bg-custom-gradient-blue flex items-center justify-center fixed z-50 bottom-[30px] right-[20px] border-[2px] border-customWhite3 shadow-customMultiple cursor-pointer'
      >
        <div className='w-[28px] h-[28px] bg-white flex items-center justify-center rounded-full text-blue-700 border-[1px] border-customWhite3'>
          <div>
            <Question />
          </div>
        </div>
      </Link>
    </>
  );
};
