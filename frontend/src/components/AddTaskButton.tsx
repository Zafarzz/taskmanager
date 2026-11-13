import { Link } from "react-router-dom";
import Plus from "../assets/icons/Plus";

export const AddTaskButton = (props: { id: number }) => {
  const { id } = props;
  return (
    <>
      <Link
        to={"/task/create/" + id}
        className="w-[64px] h-[64px] rounded-full bg-custom-gradient-blue flex items-center justify-center fixed z-50 bottom-[30px] right-[20px] border-[2px] border-customWhite3 shadow-customMultiple"
      >
        <div className="w-[28px] h-[28px] bg-white flex items-center justify-center rounded-full text-blue-700 border-[1px] border-customWhite3'">
          <Plus />
        </div>
      </Link>
    </>
  );
};
