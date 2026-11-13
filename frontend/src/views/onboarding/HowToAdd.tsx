import { Link } from "react-router-dom";
import { t } from "i18next";
import Logo from "../../assets/icons/Logo";

interface IFunction {
  setPage?: (page: number) => void;
}

const HowToAdd = ({ setPage }: IFunction) => {
  return (
    <div className='bg-custom-gradient-blue p-8 h-full max-h-[583px]:h-max'>
      <div>
        <div className='h-[120px] flex items-center justify-center'>
          <Logo />
        </div>
        <div className='h-max mt-2'>
          <p className='text-[32px] font-medium text-white leading-[38px] font-sfpro'>
            {t("how_to_add")}
          </p>
          <div className='flex flex-col gap-3 mt-[25px]'>
            <div className='shadow-custom border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-4 p-4 rounded-[20px]'>
              <div>
                <div className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px] font-sfpro'>
                  1
                </div>
              </div>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("add_bot_to_group")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-4 p-4 rounded-[20px]'>
              <div>
                <div className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px] font-sfpro'>
                  2
                </div>
              </div>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("make_bot_admin")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-4 p-4 rounded-[20px]'>
              <div>
                <div className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px] font-sfpro'>
                  3
                </div>
              </div>
              <p className='font-medium text-[17px] text-white leading-[20px] font-sfpro'>
                {t("enable_necessary_permissions")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        {setPage ? (
          <div
            className='h-[52px] flex items-center justify-center rounded-custom-16 font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom font-sfpro'
            onClick={() => setPage(2)}
          >
            <p className='text-white'>{t("next")}</p>
          </div>
        ) : (
          <Link
            to={"/"}
            className='h-[52px] flex items-center justify-center rounded-custom-16 font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom text-white font-sfpro'
          >
            {t("understood")}
          </Link>
        )}
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default HowToAdd;
