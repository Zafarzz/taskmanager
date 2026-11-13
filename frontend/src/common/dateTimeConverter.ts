import { t } from "i18next";

export const dateTimeConverter = {
  convertTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const dayDifference = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    const monthNames = [
      t("jan"),
      t("feb"),
      t("mar"),
      t("apr"),
      t("may"),
      t("jun"),
      t("jul"),
      t("aug"),
      t("sep"),
      t("oct"),
      t("nov"),
      t("dec"),
    ];

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (dayDifference === 0) {
      return `${t("today")}, ${hours}:${minutes}`;
    } else if (dayDifference === 1) {
      return `${t("yesterday")}, ${hours}:${minutes}`;
    } else {
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      return `${day} ${month}, ${hours}:${minutes}`;
    }
  },

  convertDay(date: string) {
    const dateDay = new Date(date);
    const now = new Date();

    const dayDifference = Math.floor(
      (now.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    const monthNames = [
      t("jan"),
      t("feb"),
      t("mar"),
      t("apr"),
      t("may"),
      t("jun"),
      t("jul"),
      t("aug"),
      t("sep"),
      t("oct"),
      t("nov"),
      t("dec"),
    ];

    if (dayDifference === 0) {
      return t("today");
    } else if (dayDifference === 1) {
      return t("yesterday");
    } else {
      const day = dateDay.getDate();
      const month = monthNames[dateDay.getMonth()];
      return `${day} ${month}`;
    }
  },
};
