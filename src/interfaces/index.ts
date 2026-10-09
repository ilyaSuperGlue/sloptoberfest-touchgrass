export type Language = "en" | "id";
export type Page = "welcome" | "quests" | "history";
export type Quest = {
  icon: string;
  title: string;
  titleId: string;
  copy: string;
  copyId: string;
  tag: string;
};
