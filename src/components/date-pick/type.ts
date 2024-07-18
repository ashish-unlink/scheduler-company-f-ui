import { Dayjs } from "dayjs";
import React from "react";

export interface DOBProps{
    name:string;
    label?:string;
    placeholder:string;
    onChange:(e:any)=>void;
    value?:string | object;
    onBlur?:(e:React.ReactElement)=>void;
    error?:any;
    disablePast?:boolean;
    disableFuture?:boolean;
    disabled?:boolean;
    mandatory?:boolean;
    format?: string;
    minDate?:Dayjs
}