import SettingsComponent, { IPropsGroup } from "../components/SettingsComponent";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { useGroups, useSaveSelectedGroups } from "../data/hooks/group";
import { Loader } from "../components/mini/Loader";
import WebApp from "@twa-dev/sdk";


const SettingsProjects = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#ffffff");
  }, [])
  
  const { data, isLoading } = useGroups();

  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>({});

  const handleUpdateGroup = (id: number, isSelected: boolean) => {
    setSelectedGroups((prev) => ({ ...prev, [id]: isSelected }));
  };

  const saveSelectedGroupsMutation = useSaveSelectedGroups();

  const handleSave = () => {
    saveSelectedGroupsMutation.mutate(selectedGroups);
  };

  if (isLoading) {
    return <Loader customClass="h-[100vh]" />
  }

  return (
    <div className='px-3 relative'>
      <div className='h-[56px]' />
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-white z-10'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <p
          className='font-medium text-[17px] text-customDark capitalize font-sfpro'
        >
          {t('project_settings')}
        </p>
        <div
          className='w-[60px] h-full flex justify-end items-center'
        ></div>
      </div>
      <div className='flex flex-col gap-[7px] bg-white rounded-custom-16 overflow-hidden mt-3'>
        {data?.map((group: IPropsGroup, index: number) => (
          <SettingsComponent
            key={index}
            group={group}
            handleUpdateGroup={handleUpdateGroup}
            isSelected={selectedGroups[group.id] || group.is_selected}
          />
        ))}
      </div>
      <div className='fixed bg-[#f2f2f7] bottom-0 left-3 right-3 flex justify-center pb-[42px] pt-[8px]'>
        <div
          className='  w-[94%] bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl'
          onClick={handleSave}
        >
          {t('save')}
        </div>
      </div>
    </div>
  );
};

export default SettingsProjects;