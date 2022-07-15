import {Link, useNavigate} from "react-router-dom";
import { getUser, logout } from "../services/authorize";

const NavBarComponent = () => {
    const navigate = useNavigate();
    return (
        // <nav className="navbar navbar-expand-lg navbar-primary bg-light">
        //     <div className="container-fluid">
        //         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggle">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //         <div className="collapse navbar-collapse" id="navbarToggle">
                    // <ul className="navbar-nav justify-content-end">
                    //     <li className="nav-item">
                    //         <Link to="/" className="nav-link">หน้าแรก</Link>
                    //     </li>
                    //     {
                    //         // ถ้าหากไม่มีข้อมูล user ให้แสดงเข้าสู่ระบบ
                    //         !getUser() && (
                    //             <li className="nav-item">
                    //                 <Link to="/login" className="nav-link">เข้าสู่ระบบ</Link>
                    //             </li>
                    //         )
                    //     }
                    //     {getUser() && (
                    //             <li className="nav-item">
                    //                 <Link to="/create" className="nav-link">เขียนบทความ</Link>
                    //             </li>
                    //         )}
                    //     {getUser () && (
                    //         <li className="nav-item">
                    //             <button className="nav-link" onClick={()=>logout(()=>navigate("/"))}>ออกจากระบบ</button>
                    //         </li>
                    //     )}
                    // </ul>
        //         </div>
        //     </div>
        // </nav>

        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">หน้าแรก</Link>
                        </li>
                        {
                            // ถ้าหากไม่มีข้อมูล user ให้แสดงเข้าสู่ระบบ
                            !getUser() && (
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">เข้าสู่ระบบ</Link>
                                </li>
                            )
                        }
                        {getUser() && (
                                <li className="nav-item">
                                    <Link to="/create" className="nav-link">เขียนบทความ</Link>
                                </li>
                            )}
                        {getUser () && (
                            <li className="nav-item">
                                <Link to="" className="nav-link" onClick={() => logout(() => navigate("/"))}>ออกจากระบบ</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBarComponent;