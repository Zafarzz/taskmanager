// img
import { t } from "i18next";
import Logo from "../../assets/icons/Logo";

interface IFunction {
  setPage: (page: number) => void;
}

const UsefullCommand = ({ setPage }: IFunction) => {
  return (
    <div className='bg-custom-gradient-blue p-8 h-[100vh] max-h-[634px]:h-max'>
      <div>
        <div className='h-[120px] flex items-center justify-center'>
          <Logo />
        </div>
        <div className='h-max mt-2'>
          <p className='text-2xl text-center font-medium text-white leading-[38px] font-sfpro'>
            {t("useful_commands_for_chats")}
          </p>
          <div className='flex flex-col gap-3 mt-[25px]'>
            <div className='shadow-custom border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-4 rounded-[20px]'>
              <span className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white font-sfpro'>
                /add
              </span>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("create_task")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-4 rounded-[20px]'>
              <span className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white font-sfpro'>
                /tasks
              </span>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("show_project_list")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-4 rounded-[20px]'>
              <span className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white font-sfpro'>
                /done
              </span>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("translate_to_status_ready")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-4 rounded-[20px]'>
              <span className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white font-sfpro'>
                /dashboard
              </span>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("open_app")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='bg- fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        <div
          onClick={() => setPage(4)}
          className='h-[52px] flex items-center justify-center rounded-custom-16 font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom font-sfpro'
        >
          <p className='text-white'>{t("understood")}</p>
        </div>
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default UsefullCommand;
