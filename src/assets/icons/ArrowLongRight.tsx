const ArrowLongRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
  >
    <g filter="url(#a)">
      <path
        fill="#000"
        d="M14.403 9.958c0 .193-.076.343-.243.502l-2.913 2.922a.618.618 0 0 1-.452.184.619.619 0 0 1-.628-.636c0-.184.075-.344.193-.46l1.071-1.064 1.046-.87-1.824.067H6.166c-.377 0-.653-.268-.653-.645 0-.385.276-.653.653-.653h4.487l1.824.076-1.046-.87-1.071-1.064a.72.72 0 0 1-.193-.469c0-.36.268-.628.628-.628.184 0 .335.06.452.176l2.913 2.93c.176.176.243.31.243.502Z"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={16.89}
        height={15.215}
        x={1.513}
        y={3.35}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.05 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1739_6123"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1739_6123"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
)
export default ArrowLongRight
