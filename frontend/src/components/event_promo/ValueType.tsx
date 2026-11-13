import React from 'react';
import { t } from "i18next";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";

interface OldValueMapProps {
  value: string;
}

const ValueType: React.FC<OldValueMapProps> = ({ value }) => {
  const valueMap: { [key: string]: string } = {
    "1": t("priority_data_1"),
    "2": t("priority_data_2"),
    "3": t("priority_data_3"),
    "": t("Nobody"),
  };

  return <span>{valueMap[value] || capitalizeFirstLetter(value)}</span>;
};

export default ValueType;
