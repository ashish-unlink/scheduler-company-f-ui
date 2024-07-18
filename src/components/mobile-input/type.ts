export interface MobilePhoneInputProps {
  label: string;
  name: string;
  placeholder:string,
  onChange:(val:string)=>void,
  onBlur?:(e:any)=>void,
  value:string,
  error:any,
  mandatory?:boolean,
}
