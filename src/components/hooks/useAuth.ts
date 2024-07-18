import { useAppSelector } from "../../redux";
import { selectAuthData } from "../../redux/auth/selector";

export default function useAuth() {
  const auth = useAppSelector(selectAuthData);
  if (auth) {
    return true;
  }
  return false;
}
