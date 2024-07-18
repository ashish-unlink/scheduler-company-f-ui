import { FormikErrors } from "formik";
import { ResponseServiceList, ServiceListItem, Users } from "../../utils/types/responseType";

export interface DropDownUserProps {
  label?: string;
  option: Users[];
  // option: any;
  value:string,
  icon:string;
  // handleOptionSelect:(event:any, options:Users)=>void;
  placeholder:string;
  renderOption:(props:any, options:any) => React.ReactNode;
  renderFilterOptions:(props:any, options:any)=>[],
  mandatory?:boolean;
  error?: string;
}


export interface MultiSelectAutoCompleteProps {
  label: string;
  option:any;
  defaultValue?: {},
  id?:string;
  // value?:ServiceListItem[] | [],
  value?: any,
  placeholder?:string;
  multiple?:boolean;
  disabled?:boolean;
  onChange:(e:any,newValue:any)=>void;
  mandatory?:boolean;
  onBlur?:(e:any)=> void;
  error?:any;
}

