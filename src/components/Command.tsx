import { t } from "i18next";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

interface ICommand {
  handleOnboardingClose: (isOpen: boolean) => void;
}

const Command = ({ handleOnboardingClose }: ICommand) => {
  return (
    <div className='bg-white shadow-custom p-4 rounded-custom-16 mb-3'>
      <div className='flex justify-between items-center'>
        <p
          className='font-medium text-[17px] font-sfpro'
        >
          {t('useful_commands')}
        </p>
        <div
          className='w-[24px] h-[24px] bg-customGrayLight rounded-full flex items-center justify-center text-white'
          onClick={() => handleOnboardingClose(false)}
        >
          <IoClose />
        </div>
      </div>
      <p
        className='font-light text-[14px] text-customBlack mt-1 font-sfpro'
      >
        {t('bot_commands_for_simplified_work')}
      </p>
      <Link
        to={"/onboarding"}
        className='w-[72px] h-[28px] bg-custom-gradient-blue flex justify-center items-center rounded-[8px] cursor-pointer mt-2 text-white text-[13px] font-medium font-sfpro'
      >
        {t('study')}
      </Link>
    </div>
  );
};

export default Command;
