import { Navigate } from "react-router";

const WithAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />
  return <>{children}</>;
}

export default WithAuth;