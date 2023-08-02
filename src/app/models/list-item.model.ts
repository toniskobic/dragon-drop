export interface ListItem {
  label: string;
  icon: string;
  onClick?: () => Promise<void> | void;
}
