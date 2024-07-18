import { Users } from "../../utils/types/responseType";

export interface DropDownProps {
  label: string;
  option: any;
  icon?: string;
  onSelectedValue?: (e:any,data:any) => void;
  id:string;
  name: string;
  value: string;
  error?: string |boolean | undefined;
  mandatory:boolean;
}
