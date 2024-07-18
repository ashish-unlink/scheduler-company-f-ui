export  interface TextAreaProps{
    label:string;
    id:string;
    name:string;
    onChange:(e:any)=>void;
    onBlur:(e:any)=> void;
    value:string;
    rows:number;
    cols:number;
    error?:string;
    placeholder:string;
    style:any;
    maxLength:number;
}