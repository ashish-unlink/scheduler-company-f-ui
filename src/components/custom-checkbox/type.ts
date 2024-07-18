export interface CustomCheckboxProps {
  label: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: boolean;
  checkboxText: string;
  name: string;
}
