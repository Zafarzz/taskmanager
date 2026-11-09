import { AvatarUser } from "./mini/AvatarUser";
import { dateTimeConverter } from "../common/dateTimeConverter";
import useUserColor from "../common/useUserColor";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { UserInterface } from "../data/hooks/users/interface";

interface IComment {
  comment: ICommentIn;
}

export interface ICommentIn {
  id: number,
  user_id: number,
  comment: string,
  created_at: string,
  user: UserInterface,
  image: string
}

const Comment = ({ comment }: IComment) => {
  const { color1000, color120 } = useUserColor(comment.user_id);
  return (
    <div className='flex gap-5' key={comment.id}>
      <AvatarUser
        alt={comment.user ? comment.user.name : "No user"}
        id={comment.user.telegram_id}
      />
      <div className='bg-[#f2f2f7] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] p-3 w-full'>
        <div className='flex w-full justify-between mb-3'>
          <div
            className='text-[12px] px-2 rounded-md text-white font-medium font-sfpro'
            style={{ background: color120, color: color1000 }}
          >
            {comment.user ? comment.user.name : "No user"}
          </div>
          <div className=' text-[12px] text-gray-500'>
            {comment.created_at &&
              dateTimeConverter.convertTime(comment.created_at)}
          </div>
        </div>
        <div
          className='px-1 font-medium text-gray-700 text-sm font-sfpro'
        >
          {capitalizeFirstLetter(comment.comment)}
        </div>
      </div>
    </div>
  );
};

export default Comment;
