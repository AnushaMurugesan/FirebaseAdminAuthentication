import React ,{useContext}  from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authcontext";

function ProtectiveRoute({ element: Component, ...rest }) {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
export default ProtectiveRoute;
