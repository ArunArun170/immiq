import {Navigate,Outlet} from "react-router-dom";
export default function ProtectedCorporateRoute(){const token=localStorage.getItem("immiq_corporate_token");const userRaw=localStorage.getItem("immiq_corporate_user");let user:any=null;try{user=userRaw?JSON.parse(userRaw):null}catch{}if(!token||user?.role!=="client")return <Navigate to="/corporate/login" replace/>;return <Outlet/>;}
