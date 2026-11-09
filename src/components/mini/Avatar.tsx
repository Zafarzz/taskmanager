import clsx from "clsx";
import useUserColor from "../../common/useUserColor";

export const Avatar = (props: {
  image: string;
  alt?: string;
  width?: number;
  radius?: number;
  id: number;
  bgColor?: string;
  border?: number;
  borderColor?: string;
  shadow?: string;
  top?: number;
  textClass?: string;
  avatarClass?: string;
}) => {
  const {
    width,
    image,
    alt,
    radius,
    id,
    bgColor,
    borderColor,
    textClass,
    avatarClass,
  } = props;

  const initials = alt
    ?.split(" ")
    .slice(0, 2)
    .map((word) => {
      const letter = word[0];
      return /[a-zA-Z\u0400-\u04FF-#]/.test(letter) ? letter : "";
    })
    .join("");

  const { color } = useUserColor(id);

  return image ? (
    <img
      src={image}
      alt={alt}
      style={{
        width: `${width ? width : 40}px`,
        height: `${width ? width : 40}px`,
      }}
      className={`rounded-[${radius}px] border`}
    />
  ) : (
    <div
      style={{
        background: bgColor ?? color,
        borderColor: borderColor
      }}
      className={clsx(
        `border flex justify-center items-center uppercase text-white backdrop-blur-xl`,
        avatarClass,
      )}
    >
      <p className={clsx("relative", textClass)}>{initials}</p>
    </div>
  );
};
