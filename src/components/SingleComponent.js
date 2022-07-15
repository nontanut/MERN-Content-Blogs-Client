import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBarComponent from "./NavBarComponent";
import renderHTML from "react-render-html";

const SingleComponent = () => {
    const [blog, setBlog] = useState("");
    const {slug} = useParams(); // อิงค่า params จาก slug
    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API}/blog/${slug}`)
        .then(response => {
            setBlog(response.data)
        })
        .catch(err => alert(err))
        // eslint-disable-next-line
        }, [])
    return(
        <div className="container p-5">
            <NavBarComponent/>
            {/* ให้ข้อมูลวิ่งมาก่อนแล้วค่อยแสดง */}
            {blog && <div>
                <h1 className="text-center">{blog.title}</h1>
                <img src={blog.image.url} alt="" style={{width: "100%", maxWidth: "650px", maxHeight: "400px", display: "block", margin: "auto auto"}}/>
                <div className="mt-3" style={{textAlign: "justify"}}>{renderHTML(blog.content)}</div>
                <p className="text-muted text-end mt-3">ผู้เขียน: {blog.author}, เผยแพร่: {new Date(blog.createdAt).toLocaleString()}</p>
            </div>}
        </div>
    )
}

export default SingleComponent;