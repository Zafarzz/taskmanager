import { t } from "i18next";

export const getEventTypeMap = (): { [key: string]: string } => ({
  status: t("status_changed"),
  priority: t("priority_changed"),
  created: t("task_created"),
  comment: t("comment"),
  participant: t("participants_changed"),
  archive: t("added_to_archive"),
  default: t("performers_assigned"),
});
