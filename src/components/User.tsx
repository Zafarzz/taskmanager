import { useReducer } from "react";
import { AvatarUser } from "./mini/AvatarUser";
// import ArrowRight from "../assets/icons/ArrowRight";
import { role } from "../views/GroupSettings";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
// import RoleSelector from "./role_selector/RoleSelector";
import { UserInterface } from "../data/hooks/users/interface";

interface IProps {
  user: UserInterface;
  roles: role[];
}

interface IState {
  selectRole: role | null;
  roles: role[];
  isOpenRoleSelector: boolean;
}

const initialState: IState = {
  selectRole: null,
  roles: [],
  isOpenRoleSelector: false,
};

const User = (props: IProps) => {
  const { user, roles } = props;
  const [state, setState] = useReducer(
    (state: IState, setState: Partial<IState>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );
  state
  roles


  const handleOpenRoleSelector = () => {
    setState({ isOpenRoleSelector: true });
  };
  return (
    <>
      <div className='flex items-center justify-between py-6 px-3'>
        <div className='flex items-center h-[44px] '>
          <div className='min-w-[44px]'>
            <AvatarUser
              alt={user.name}
              width={32}
              height={32}
              id={Number(user?.telegram_id)}
            />
          </div>
          <div className={`ml-2 w-full`}>
            <p className='text-sm font-sans'>{user?.name}</p>
            <p className='text-[12px] font-sans text-gray-400'>
              @{user.username}
            </p>
          </div>
        </div>
        <div
          className='flex items-center gap-1'
          onClick={handleOpenRoleSelector}
        >
          <p className='text-customBlack font-sfpro font-normal'>
            {capitalizeFirstLetter(user?.role)}
          </p>
          {/* <ArrowRight width={13} height={13} /> */}
        </div>
      </div>

      {/* <RoleSelector
        selectRole={state.selectRole}
        setSelectRole={setState}
        roles={roles}
        isOpenRoleSelector={state.isOpenRoleSelector}
        user={user}
      /> */}
    </>
  );
};

export default User;
