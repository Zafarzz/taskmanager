import clsx from "clsx";
import { role } from "../../views/GroupSettings";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";

interface IProps {
  role: role;
  userRole: string;
  handleStatusUpdate: (role: role) => void;
}

const RoleSelectorChild = (props: IProps) => {
  const { role, userRole, handleStatusUpdate } = props;

  const isActive = role.name === userRole;
  return (
    <div
      onClick={() => {
        handleStatusUpdate(role);
      }}
      key={role.id}
      className={clsx(
        isActive && "bg-gray-100",
        "p-4 rounded-xl flex justify-between items-center",
      )}
    >
      <div className='flex gap-4'>
        <div className={clsx(isActive && "text-gradient-blue")}>
          {role.name && capitalizeFirstLetter(role.name)}
        </div>
      </div>
      <div
        className={clsx(
          isActive ? "border-blue-500" : "border-gray-400",
          "flex justify-center items-center rounded border w-5 h-5",
        )}
      >
        {isActive && (
          <div className='bg-custom-gradient-blue w-3 h-3 rounded-sm'></div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectorChild;
