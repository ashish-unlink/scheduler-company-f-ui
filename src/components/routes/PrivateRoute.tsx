import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../side-menu-bar/Layout";
import translateLabel from "../hooks/translationLable";

export default function PrivateRoute({
  children,
  label,
}: {
  children: React.ReactElement;
  label: string;
}) {
  const auth = useAuth();
  return auth ? (
    <>
      <Layout label={translateLabel(label)}>{children}</Layout>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
