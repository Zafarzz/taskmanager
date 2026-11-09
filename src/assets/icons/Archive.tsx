interface IArchive {
  width?: number,
  height?: number
  opacity?: number;
}

const Archive = (props: IArchive) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillOpacity={props.opacity || .2}
      d="M6.244 21.084h11.02c1.978 0 3.033-1.025 3.033-2.994V8.478H3.211v9.612c0 1.98 1.055 2.994 3.033 2.994Zm2.2-8.98c-.422 0-.713-.292-.713-.733v-.312c0-.442.291-.723.713-.723h6.63c.422 0 .723.281.723.723v.312c0 .441-.301.733-.723.733h-6.63ZM3.422 7.102h16.664c1.135 0 1.708-.673 1.708-1.798v-.915c0-1.125-.573-1.798-1.708-1.798H3.422c-1.075 0-1.708.673-1.708 1.798v.915c0 1.125.573 1.798 1.708 1.798Z"
    />
  </svg>
)
export default Archive
