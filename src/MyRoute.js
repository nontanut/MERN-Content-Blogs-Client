import { Routes, Route } from "react-router-dom";
import App from "./App";
import EditComponent from "./components/EditComponent";
import FormComponent from "./components/FormComponent";
import LoginComponent from "./components/LoginComponent";
import SingleComponent from "./components/SingleComponent";
import AdminRoute from "./AdminRoute";

const MyRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="" element={<AdminRoute />}>
                <Route path="/create" element={<FormComponent/>} />
            </Route>    
            <Route path="/blog/:slug" element={<SingleComponent/>} />
            <Route path="" element={<AdminRoute />}>
                <Route path="/blog/edit/:slug" element={<EditComponent/>} />
            </Route>
            <Route path="/login" element={<LoginComponent/>} />
        </Routes>
    );
};

export default MyRoute;