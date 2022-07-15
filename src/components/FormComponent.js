import { useState } from "react";
import NavBarComponent from "./NavBarComponent";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getUser, getToken } from "../services/authorize";
import "../customs/Form.css";

const FormComponent = () => {
    const [state, setState] = useState({
        title: "",
        author: getUser()
    });
    const {title, author} = state;

    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const [content, setContent] = useState("");

    // กำหนดค่าให้ state มี 2 func คือ name=obj{state}, event
    const inputValue = name => e => {
        setState({...state, [name]:e.target.value});
    }

    const submitContent = e => {
        setContent(e);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        // เชื่อม api
        axios
        .post(`${process.env.REACT_APP_API}/create`, 
        {image, title, content, author},
        {headers:{
            // ตรวจสอบ Token
            authorization: `Bearer ${getToken()}`
        }})
        .then(response => {
            Swal.fire(
                'แจ้งเตือน!', // title
                'บันทึกบทความเรียบร้อย', // เนื้อหา
                'success' // รูปแบบ
              )
              setState({...state, title:""})
              setContent("");
              setImage(false)
        }).catch(err => {
            Swal.fire(
                'แจ้งเตือน',
                err.response.data.error,
                'error'
            )
        })
    }

    // upload image
    const handleUpload = async (e) => {
        e.preventDefault()
        try {
            // admin can upload
            if (!getUser) {
                return Swal.fire(
                    'แจ้งเตือน',
                    'สำหรับแอดมินเท่านั้น',
                    'error'
                )
            }

            const file = e.target.files[0]

            // เพิ่มภาพก่อน submit
            if (!file) {
                return Swal.fire(
                    'แจ้งเตือน',
                    'กรุณาเพิ่มภาพ',
                    'error'
                )
            }

            // size = 1mb
            if (file.size > 1024 * 1024) {
                return Swal.fire(
                    'ไฟล์ใหญ่เกินไป',
                    'ขนาดไฟล์ไม่เกิน 1mb',
                    'error'
                )
            }

            // format file
            if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
                return Swal.fire(
                    'รูปแบบไฟล์ผิดพลาด',
                    'สามารถอัพไฟล์ภาพได้ดังนี้ JPG/JPEG/PNG',
                    'error'
                )
            }

            let formData = new FormData();
            formData.append("file", file);

            setLoading(true);

            const res = await axios.post(`${process.env.REACT_APP_API}/upload`, formData, {
                headers: {"content-type": "multipart/form-data", authorization: `Bearer ${getToken()}`}
            })

            setLoading(false);
            setImage(res.data);
        } catch (err) {
            Swal.fire(
                'แจ้งเตือน',
                err.response.data.error,
                'error'
            )
        }
    }

    // delete image
    const handleDelete = async (e) => {
        try {
            if (!getUser) {
                return Swal.fire(
                    'แจ้งเตือน!',
                    'สำหรับแอดมินเท่านั้น',
                    'error'
                )
            }
            setLoading(true);

            // delete image
            await axios.post(`${process.env.REACT_APP_API}/img/delete`, {public_id: image.public_id}, {
                headers: {authorization: `Bearer ${getToken()}`}
            })

            setLoading(false);
            setImage(false);
        } catch (err) {
            Swal.fire(
                'แจ้งเตือน',
                err.response.data.error,
                'error'
            )
        }
    }

    const upload = {display: image ? "block" : "none"};
    return (
        <div className="container p-5">
            <NavBarComponent />
            <h1 className="text-center">เขียนบทความ</h1>
            <div className="w-100 border border-2 p-2 m-auto" style={{maxWidth: "700px", height: "500px", position: "relative"}}>
                <input 
                    type="file" 
                    name="file" 
                    id="file_up" 
                    onChange={handleUpload}
                />
                {
                    loading ? 
                    <div id="file_img">
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-secondary m-5" style={{width: "20rem", height: "20rem"}} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>

                    :<div id="file_img" style={upload}>
                        <img src={image ? image.url : ""} alt="" />
                        <span onClick={handleDelete}>X</span>
                    </div>
                }
            </div>
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <label>ชื่อบทความ</label>
                    <input type="text" className="form-control" value={title} onChange={inputValue("title")}/>
                </div>
                <div className="form-group">
                    <label>รายละเอียด</label>
                    <ReactQuill
                        value={content}
                        onChange={submitContent}
                        theme="snow"
                        className="pb-3  mb-3"
                        placeholder="รายละเอียดบทความ"
                        style={{border:"1px solid #666"}}
                    />
                </div>
                <div className="form-group">
                    <label>ผู้เขียน</label>
                    <input type="text" className="form-control" value={author} onChange={inputValue("author")}/>
                </div>
                <input type="submit" value="บันทึก" className="btn btn-primary mt-2" />
            </form>
        </div>
    );
};

export default FormComponent;