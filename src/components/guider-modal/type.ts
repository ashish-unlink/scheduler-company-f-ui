import { NavigateFunction } from "react-router-dom";

export interface GuiderProps {
  open: boolean;
  data: GuiderModalProps;
}

export interface GuiderModalProps {
  title: string;
  text: string;
  note?:string;
  btnGroup: {
    repeat?: {
      name: string;
      onClick: (navigate:NavigateFunction) => void;
    };
    procced: {
      name: string;
      onClick: (navigate:NavigateFunction) => void;
    };
  };
}
