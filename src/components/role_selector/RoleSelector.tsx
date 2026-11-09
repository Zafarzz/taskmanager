import { useParams } from "react-router-dom";
import { roleData, useRoleConnectWithUser } from "../../data/hooks/roles";
import { role } from "../../views/GroupSettings";
import { toast } from "react-toastify";
import RoleSelectorChild from "./RoleSelectorChild";
import { UserInterface } from "../../data/hooks/users/interface";

interface IProps {
  selectRole: role | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectRole: any;
  roles: role[];
  isOpenRoleSelector: boolean;
  user: UserInterface;
}

const RoleSelector = (props: IProps) => {
  const { id } = useParams();

  const { setSelectRole, roles, isOpenRoleSelector, user } = props;

  const { mutate: roleConnectWithUserMutate } = useRoleConnectWithUser();

  const handleStatusUpdate = async (role: role) => {
    const roleData: roleData = {
      role_id: Number(role.id),
      user_id: Number(user.telegram_id),
    };

    roleConnectWithUserMutate(
      { id: Number(id), role: roleData },
      {
        onSuccess: () => {
          setSelectRole({ selectRole: role, isOpenRoleSelector: false });
        },
        onError: (error) => {
          console.log(error);
          toast.error("Didn't change role", {
            position: "top-right",
            autoClose: 3000,
          });
        },
      },
    );
  };

  return (
    <>
      {isOpenRoleSelector && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 left-0 w-full h-full'
          onClick={() => setSelectRole({ isOpenRoleSelector: false })}
        ></div>
      )}
      <div
        className={`${
          isOpenRoleSelector ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white p-[12px] left-3 right-3 flex flex-col gap-2`}
      >
        {roles?.length > 0 &&
          roles.map((role: role, index: number) => (
            <RoleSelectorChild role={role} userRole={user.role} handleStatusUpdate={handleStatusUpdate} key={index} />
          ))}
      </div>
    </>
  );
};

export default RoleSelector;
