import { t } from "i18next";
import Loading from "../../assets/icons/Loading";
import clsx from "clsx";
interface iProps {
  customClass?: string;
}
export const Loader = (props: iProps) => {
  const { customClass } = props;
  return (
    <div
      className={clsx("w-full flex flex-col justify-center items-center", customClass)}
    >
      <div className='overlay'>
        <Loading />
      </div>
      <p className='mt-2 text-slate-500 text-sm'>{t("loading")}</p>
    </div>
  );
};
