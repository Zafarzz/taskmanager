const Calendar = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
  >
    <g>
      <path
        fill='url(#b)'
        d='M3.9 8.598h3.495c.261 0 .469-.2.469-.468V3.616a.46.46 0 0 0-.469-.462c-.261 0-.462.201-.462.462v4.051H3.9c-.268 0-.47.201-.47.463 0 .267.202.468.47.468Zm3.502 6.107c3.736 0 6.83-3.1 6.83-6.83 0-3.737-3.1-6.83-6.837-6.83-3.73 0-6.824 3.093-6.824 6.83 0 3.73 3.1 6.83 6.83 6.83Zm0-1.138a5.664 5.664 0 0 1-5.686-5.692 5.659 5.659 0 0 1 5.68-5.692 5.676 5.676 0 0 1 5.698 5.692 5.67 5.67 0 0 1-5.692 5.692Z'
      />
    </g>
    <defs>
      <linearGradient
        id='b'
        x1={7.402}
        x2={7.402}
        y1={1.045}
        y2={14.705}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#007AFF' />
        <stop offset={1} stopColor='#5856D6' />
      </linearGradient>
      <clipPath id='a'>
        <path fill='#fff' d='M.571 0h15.281v15.757H.572z' />
      </clipPath>
    </defs>
  </svg>
);
export default Calendar;
