import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBarComponent from "./NavBarComponent";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getToken, getUser } from "../services/authorize";
import "../customs/Form.css";

const EditComponent = () => {
    const {slug} = useParams();
    const [state, setState] = useState({
        title: "",
        author: "",
        slug: ""
    });
    const {title, author} = state; // restructoring
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(false);

    const submitContent = e => {
        setContent(e);
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

    // call data by id
    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API}/blog/${slug}`)
        .then(response => {
            // restructoring
            const {image, title, content, author, slug} = response.data
            setState({...state, title, author, slug})
            setContent(content);
            setImage(image);
        })
        .catch(err => alert(err))
        // eslint-disable-next-line
        }, [])
    
    // ใช้แบบ jsx แทน function
    const showUpdateForm = () => (
        <>
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
                        className="pb-3 mb-3"
                        style={{border:"1px solid #666"}}
                    />
                </div>
                <div className="form-group">
                    <label>ผู้เขียน</label>
                    <input type="text" className="form-control" value={author} onChange={inputValue("author")}/>
                </div>
                <input type="submit" value="อัพเดท" className="btn btn-primary mt-2" />
            </form>
            </>
    )

    // กำหนดค่าให้ state มี 2 func คือ name=obj{state}, event
    const inputValue = name => e => {
        setState({...state, [name]:e.target.value});
    }
    const submitForm = (e) => {
        e.preventDefault();
        console.log("API URL", process.env.REACT_APP_API)
        // เชื่อม api
        axios
        .put(`${process.env.REACT_APP_API}/blog/${slug}`, {image, title, content, author},
        {headers: {
            authorization: `Bearer ${getToken()}`
        }})
        .then(response => {
            Swal.fire(
                'แจ้งเตือน!',
                'อัพเดทบทความเรียบร้อย',
                'success'
              )
              const {image, title, content, author, slug} = response.data;
              setState({...state, title, author, slug})
              setContent(content);
              setImage(image);
        }).catch(err => {
            Swal.fire(
                'แจ้งเตือน',
                err.response.data.error,
                'error'
            )
        })
    }

    return (
        <div className="container p-5">
            <NavBarComponent />
            <h1 className="text-center">แก้ไขบทความ</h1>
            {showUpdateForm()}
        </div>
    );
};

export default EditComponent;