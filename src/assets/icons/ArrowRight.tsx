interface IArrowIcon {
  width?: number;
  height?: number;
  stroke?: string;
  opacity?: number;
}

const ArrowRight = (props: IArrowIcon) => (
  <svg
    width={props.width || 16}
    height={props.height || 16}
    fill='none'
    viewBox='0 0 16 16'
    {...props}
  >
    <path
      stroke={props.stroke || '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeOpacity={props.opacity || 0.2}
      strokeWidth={2}
      d='m6 3 5 5-5 5'
    />
  </svg>
);
export default ArrowRight;
