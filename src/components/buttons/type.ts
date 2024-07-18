export interface ButtonType {
    children: React.ReactNode;
    onClick?: () => void;
    disabled ?: boolean;
    style?:any;
    variant?:"text" | "contained" | "outlined",
    color?:"success" | "primary" | "error" | "warning" | "secondary";
    type?: "submit" | "button" ;
}