import { Symbol } from "../assets/icons/Symbol";

const Notification = () => {
  return (
    <div className='p-3'>
      <div className='px-3 flex items-center justify-between'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          уведомления в чат
        </p>
        <p className='font-normal text-[15px] text-customBlue'>Выключить все</p>
      </div>
      <div>
        <div className='mt-2 bg-white rounded-xl py-2'>
          <label className='flex justify-between px-4 py-1 items-center'>
            <div>
              <p className='text-[17px] font-sans'>Создание задачи</p>
              <p className='font-normal text-[13px] text-customBlack'>/add</p>
            </div>
            <input type='checkbox' className='hidden peer' />
            <div className='hidden peer-checked:flex'>
              <Symbol />
            </div>
          </label>
          <label className='flex justify-between px-4 py-1 items-center'>
            <div>
              <p className='text-[17px] font-sans'>Редактирование задачи </p>
              <p className='font-normal text-[13px] text-customBlack'>/edit</p>
            </div>
            <input type='checkbox' className='hidden peer' />
            <div className='hidden peer-checked:flex'>
              <Symbol />
            </div>
          </label>
          <label className='flex justify-between px-4 py-1 items-center '>
            <div>
              <p className='text-[17px] font-sans'>Изменение статуса задачи</p>
              <p className='font-normal text-[13px] text-customBlack'>
                /changestatus
              </p>
            </div>
            <input type='checkbox' className='hidden peer' />
            <div className='hidden peer-checked:flex'>
              <Symbol />
            </div>
          </label>
          <label className='flex justify-between px-4 py-1 items-center '>
            <div>
              <p className='text-[17px] font-sans'>
                Добавление задачи в архив{" "}
              </p>
              <p className='font-normal text-[13px] text-customBlack'>
                /archive
              </p>
            </div>
            <input type='checkbox' className='hidden peer' />
            <div className='hidden peer-checked:flex'>
              <Symbol />
            </div>
          </label>
          <label className='flex justify-between px-4 py-1 items-center '>
            <div>
              <p className='text-[17px] font-sans'>Удаление задачи</p>
              <p className='font-normal text-[13px] text-customBlack'>
                /delete
              </p>
            </div>
            <input type='checkbox' className='hidden peer' />
            <div className='hidden peer-checked:flex'>
              <Symbol />
            </div>
          </label>
        </div>
        <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
          Бот будет присылать уведомления в групповой чат при этих событиях
        </p>
      </div>
    </div>
  );
};

export default Notification;
