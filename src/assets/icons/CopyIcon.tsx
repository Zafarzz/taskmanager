const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
  >
    <g>
      <path
        fill="url(#b)"
        d="M6.68 22.742h11.765c2.438 0 3.68-1.219 3.68-3.633V7.25c0-2.414-1.242-3.633-3.68-3.633H6.68C4.23 3.617 3 4.836 3 7.25v11.86c0 2.413 1.23 3.632 3.68 3.632Z"
      />
      <path
        fill="#fff"
        d="M12.363 29.762H24.13c3.328 0 5.273-1.922 5.273-5.227v-11.86c0-3.304-1.945-5.226-5.273-5.226H12.363c-3.328 0-5.273 1.91-5.273 5.227v11.86c0 3.304 1.945 5.226 5.273 5.226Z"
      />
      <path
        fill="url(#c)"
        d="M12.363 28.168H24.13c2.437 0 3.68-1.219 3.68-3.633v-11.86c0-2.413-1.243-3.632-3.68-3.632H12.363c-2.449 0-3.68 1.207-3.68 3.633v11.86c0 2.413 1.231 3.632 3.68 3.632Z"
      />
      <path
        fill="#fff"
        d="M12.527 18.617c0-.61.422-1.031 1.043-1.031h3.668v-3.668c0-.61.399-1.043.996-1.043.61 0 1.032.434 1.032 1.043v3.668h3.68c.597 0 1.03.422 1.03 1.031 0 .598-.433.996-1.03.996h-3.68v3.68c0 .61-.422 1.031-1.032 1.031-.597 0-.996-.433-.996-1.031v-3.68H13.57c-.61 0-1.043-.398-1.043-.996Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={12.563}
        x2={12.563}
        y1={3.617}
        y2={22.742}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#007AFF" />
        <stop offset={1} stopColor="#5856D6" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={18.246}
        x2={18.246}
        y1={9.043}
        y2={28.168}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#007AFF" />
        <stop offset={1} stopColor="#5856D6" />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M3 2h26.402v27.762H3z" />
      </clipPath>
    </defs>
  </svg>
)
export default CopyIcon