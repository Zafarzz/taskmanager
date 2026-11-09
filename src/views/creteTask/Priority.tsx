import { t } from "i18next";
import { useState } from "react";
import ArrowRight from "../../assets/icons/ArrowRight";
import Prioritet from "../../assets/icons/Prioritet";
import { IPriority } from "./CreateTaskFromGroup";

const priorities = [
  { title: "priority_data_1" },
  { title: "priority_data_2" },
  { title: "priority_data_3" },
];

interface Props {
  setSelectPriority: (val: number) => void;
  selectPriority: number;
}

const Priority = ({ setSelectPriority, selectPriority }: Props) => {
  const [openPriority, setOpenPriority] = useState(false);

  return (
    <>
      <div
        className="h-[44px] flex justify-between items-center px-4"
        onClick={() => setOpenPriority(true)}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-[1px] items-end justify-center">
            <Prioritet />
          </div>
          <p
            className="text-black text-base font-normal capitalize font-sfpro"
          >
            {t("priority")}
          </p>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <p
            className="font-normal text-base text-customBlack font-sfpro"
          >
            {t(`priority_data_${selectPriority}`)}
          </p>
          <ArrowRight />
        </div>
      </div>
      {openPriority && (
        <div
          className="bg-black opacity-45 z-10 fixed top-0 left-0 w-full h-full"
          onClick={() => setOpenPriority(false)}
        ></div>
      )}
      <div
        className={`${
          openPriority ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 right-3 flex flex-col gap-2`}
      >
        {priorities.map((priority: IPriority, index: number) => (
          <div
            onClick={() => {
              setSelectPriority(index + 1);
              setOpenPriority(false);
            }}
            key={index}
            className={`${
              index + 1 === selectPriority ? "bg-gray-100" : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className="flex gap-4">
              <div
                className={index + 1 === selectPriority ? "text-blue-600" : ""}
              >
                {t(priority.title)}
              </div>
            </div>
            <div
              className={`${
                index + 1 === selectPriority
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {index + 1 === selectPriority && (
                <div className="bg-blue-500 w-3 h-3 rounded-sm"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Priority;
