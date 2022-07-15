import NavBarComponent from "./components/NavBarComponent";
import axios from "axios";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import renderHTML from "react-render-html";
import {getToken, getUser} from "./services/authorize"

function App() {
  const [blogs, setBlogs] = useState([]);
  // ดึงข้อมูลบทความทั้งหมดจาก api
  const fectchData = () => {
    axios
    .get(`${process.env.REACT_APP_API}/blogs`)
    .then(response => {
      setBlogs(response.data)
    })
    .catch(err => alert(err));
  }
  // ให้ดึงข้อมูลมาตั้งแต่เริ่มต้น
  useEffect(() => {
    fectchData()
  }, []);

  const confirmDelete = (slug, public_id) => {
    console.log(public_id)
    console.log(slug)
    Swal.fire({
      title: "คุณต้องการลบบทความหรือไม่ ?",
      icon: "warning",
      showCancelButton: true
    }).then((result) => {
      // กดปุ่ม ok หรือตกลง ให้ทำอะไร
      if(result.isConfirmed) {
        deleteBlog(slug, public_id)
      }
    })
  }
  const deleteBlog = async (slug, public_id) => {
    console.log(slug)
    console.log(public_id)
    try {
      // delete image
      const deleteImage = axios.post(`${process.env.REACT_APP_API}/img/delete`, {public_id}, {
        headers: {authorization: `Bearer ${getToken()}`}
      })

      // delete blog
      const deleteBlog = axios.delete(`${process.env.REACT_APP_API}/blog/${slug}`, {
        headers: {authorization: `Bearer ${getToken()}`}
      })

      Swal.fire(
        "แจ้งเตือน",
        "ลบข้อมูลเรียบร้อยแล้ว",
        "success"
      )

      await deleteImage;
      await deleteBlog;
      fectchData();
    } catch (err) {
      Swal.fire('ลบช้อมูลเรียบร้อย', err.response.data.message, "success")
    }
  }
  return (
    <div className="container p-5">
      <NavBarComponent/>
      {blogs.map((blog, index) => (
        // เอาเลข index จาก blogs มาสร้างเป็น key
        <div className="row" key={index} style={{borderBottom:"1px solid silver"}}>
          <div className="col pt-3 pb-2">
            <Link to={`/blog/${blog.slug}`}>
              <h2>{blog.title}</h2>
            </Link>
            {/* ให้แสดงตัวอักษรตั้งแต่ตัวที่ 0 ถึง 250 */}
            <div className="pt-3">{renderHTML(blog.content.substring(0, 250))}</div>
            {/* ปรับการแสดงผลวันที่เขียนด้วย new Date */}
            <p className="text-muted mt-2">ผู้เขียน: {blog.author}, เผยแพร่: {new Date(blog.createdAt).toLocaleString()}</p>
            {getUser() && (
              <div>
                <Link className="btn btn-outline-success" to={`/blog/edit/${blog.slug}`}>แก้ไขบทความ</Link> &nbsp;
                <button className="btn btn-outline-danger" onClick={() => confirmDelete(blog.slug, blog.image.public_id)}>ลบบทความ</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
