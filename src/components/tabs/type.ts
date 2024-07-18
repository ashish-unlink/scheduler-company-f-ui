export interface MenuTabsProps {
  onChangeTab: (val: number, index?:number) => void;
  options: MenuOptions[];
}

export interface MenuOptions {
  label: string;
  component: React.ReactNode;
  value: string;
  icon?: any;
  title?: string;
}
