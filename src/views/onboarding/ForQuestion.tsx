import { Link } from "react-router-dom";
import CommentBlue from "../../assets/icons/CommentBlue";
import Logo from "../../assets/icons/Logo";
import { t } from "i18next";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";

const ForQuestion = () => {
  return (
    <div className='bg-custom-gradient-blue p-8 px-7 h-full flex flex-col items-center justify-center max-h-[547px]:h-max'>
      <div className='flex flex-col items-center py-6 gap-12'>
        <div className='flex items-center justify-center'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6'>
          <p className='font-medium text-4xl leading-10 text-white text-center font-sfpro'>
            {t("remaining_questions")}
          </p>
          <p className='font-medium text-xl text-white leading-6 text-center font-sfpro'>
            {capitalizeFirstLetter(t("contact_support"))}
          </p>
        </div>
        <Link to={"/"}>
          <div className='w-max rounded-full border-[6px] border-customWhite121 backdrop-blur-[25px] shadow-custom50'>
            <div className='w-[96px] h-[96px] rounded-full bg-white flex items-center justify-center'>
              <CommentBlue />
            </div>
          </div>
        </Link>
      </div>
      <div className='fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        <Link
          to={"/"}
          className='h-[52px] flex items-center justify-center rounded-custom-16 font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom font-sfpro'
        >
          <p className='text-white'>{capitalizeFirstLetter(t("go_to_home"))}</p>
        </Link>
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default ForQuestion;
