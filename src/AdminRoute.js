import {getUser} from "./services/authorize";
import {Navigate, Outlet} from "react-router-dom";

// dom v5
// const AdminRoute = ({component:Component, ...rest}) => (
//     <Route
//     {...rest}
//     render = {props => 
//         getUser() ? (<Component {...props}/>) : (<Redirect to={{pathname:"/login", state:{from:props.location}}} />)
//     } />
// )


// dom v6
const AdminRoute = () => {
    return getUser() ? <Outlet /> : <Navigate to="/login"/>
}

export default AdminRoute;