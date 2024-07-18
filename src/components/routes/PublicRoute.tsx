import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PrivatePath } from "../constants/routes.c";

export default function PublicRoute({ children }:any) {
  const auth = useAuth();
  return !auth ? children : <Navigate to={PrivatePath.home} />;
}
