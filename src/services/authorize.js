// เก็บ token / username => sesion storage
export const authenticate = (response, next) => {
    if(window !== "undefined") {
        // เก็บข้อมูลลง session storage และแปลง json obj => string
        sessionStorage.setItem("token", JSON.stringify(response.data.token))
        sessionStorage.setItem("user", JSON.stringify(response.data.username))
    }
    next();
} 

// ดึงข้อมูล token
export const getToken = () => {
    // เช็คว่าใน browser มีข้อมูลหรือป่าว
    if(window !== "undefined") {
        // ถ้าใน sessionStorage ของ browser มี token
        if(sessionStorage.getItem("token")) {
            // JSON.parse แปลงข้อมูลจาก string ให้เป็น json OBJ
            return JSON.parse(sessionStorage.getItem("token"))
        }else{
            return false
        }
    }
}

// ดึงข้อมูล user
export const getUser = () => {
    if(window !== "undefined") {
        // ถ้าใน sessionStorage มี token
        if(sessionStorage.getItem("user")) {
            return JSON.parse(sessionStorage.getItem("user"))
        }else{
            return false
        }
    }
}

// Logout
export const logout = (next) => {
    if(window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        // บังคับ reload หลังจากกดออกจากระบบ
        window.location.reload()
    }
    next();
}