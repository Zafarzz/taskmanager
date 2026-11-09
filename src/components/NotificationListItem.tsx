import { useState } from "react";

const NotificationListItem = (props: {title: string, subtitle?: string, checked: boolean, type: string, editNotification: (type: string, checked: boolean) => void }) => {
    const {title, subtitle, checked, type, editNotification} = props;
    const [checker, setChecker] = useState(checked);
    const updateNotification = () => {
        editNotification(type, !checked);
        setChecker(!checked);
    }

    

    return <label className='flex justify-between items-center py-[12px] px-4 bg-white'>
    <div>
      <p
        className='text-[17px] font-normal leading-6 font-sfpro'
      >
        {title}
      </p>
      {
        subtitle ?      <p
        className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'
      >
        {subtitle}
      </p> : ""
      }
 
    </div>
    <label className='relative inline-flex cursor-pointer items-center'>
      <input
        id='switch2'
        type='checkbox'
        className='peer sr-only'
        checked={checker}
        onChange={() => updateNotification()}
      />
      <label htmlFor='switch2' className='hidden'></label>
      <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
    </label>
  </label>
}

export default NotificationListItem;