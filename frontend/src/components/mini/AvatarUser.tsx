import { useEffect, useState } from "react";
import imageCacheChacker from "../../common/imagesCacher";
import useUserColor from "../../common/useUserColor";
import clsx from "clsx";

export const AvatarUser = (props: {
  alt: string;
  width?: number;
  height?: number;
  mr?: boolean;
  id: number;
  size?: number;
  shadow?: boolean;
  textClass?: string;
}) => {
  const [img, setImg] = useState("");
  
  const { color } = useUserColor(props.id);

  const avatarSize = props.width ? props.width : 24;

  
  const getPhoto = async () => {
    const result = await imageCacheChacker(`${props.id}`);
    setImg(result)
  };

  useEffect(() => {
    getPhoto();
  }, [props.id]);

  return img ? (
    <img
      src={img}
      alt={props.alt}
      className={clsx(
        `object-cover rounded-full border-[2px] border-white bg-gray-100 flex justify-center items-center`,
        !props.mr && "mr-[-12px]",
        `w-[${avatarSize}px] h-[${avatarSize}px] min-w-[${avatarSize}px]`,
        props.shadow && "shadow-customMultiple border-[3px]",
      )}
      style={{
        minWidth: `${avatarSize}px`,
        minHeight: `${avatarSize}px`,
      }}
    />
  ) : (
    <div
      className={clsx(
        `rounded-full border-[2px] border-white bg-gray-100 flex justify-center items-center text-customBlack uppercase text-md font-sfpro text-white`,
        !props.mr && "mr-[-12px]",
        props.shadow && "shadow-customMultiple border-[3px]",
      )}
      style={{
        background: color,
        width: `${avatarSize}px`,
        height: `${avatarSize}px`,
        minWidth: `${avatarSize}px`,
        minHeight: `${avatarSize}px`,
      }}
    >
      <p className={clsx("", props.textClass)}>{props.alt[0]}</p>
    </div>
  );
};
