import NavBarComponent from "./NavBarComponent";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { authenticate, getUser } from "../services/authorize";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const {username, password} = state;

    const inputValue = name => e => {
        setState({...state, [name]:e.target.value});
    }

    const submitForm = (e) => {
        e.preventDefault();
        // เชื่อม jwt ฝั่ง server and client
        axios
        .post(`${process.env.REACT_APP_API}/login`, {username, password})
        .then(response => {
            // หลัง login สำเร็จให้ push path(/create)
            authenticate(response, () => navigate("/create"))
        }).catch(err => {
            Swal.fire("แจ้งเตือน", err.response.data.error, "error")
        })
    }
    // ดักlogin ถ้า login แล้วไม่สามารถเข้าไปที่ path("/login") ได้อีก
    useEffect(() => {
        getUser() && navigate("/");
    }, [])
    return(
        <div className="container p-5">
            <NavBarComponent />
            <h1>เข้าสู่ระบบ</h1>
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" value={username} onChange={inputValue("username")}/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={inputValue("password")}/>
                </div>
                <input type="submit" value="เข้าสู่ระบบ" className="btn btn-primary mt-2" />
            </form>
        </div>
    )
}

export default LoginComponent;