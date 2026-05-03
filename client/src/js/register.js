const inpUsername = document.querySelector("#name");
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const inpConfirmPwd = document.querySelector("#confirm-password");
const registerForm = document.querySelector(".register-form");

function handleRegister(event) {
    event.preventDefault() // Ngăn chặn hành vi mặc định của form
 
    let username = inpUsername.value;
    let email = inpEmail.value;
    let password = inpPwd.value;
    let confirmPassword = inpConfirmPwd.value;
    let role_id = 2; // Mặc định là quyền của guest. ( 1: Admin, 2: Guest )

    // check fields empty
    if (!username || !email || !password || !confirmPassword) {
        // alert("Vui lòng điền đủ các trường");
        return;
    }
    if (password != confirmPassword) {
        // alert("Mật khẩu không khớp");
        return;
    }

    // Tạo tài khoản với Firebase Auth
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // Thông tin người dùng
            let userData = {
                username,
                  email,
                password,
                role_id: role_id,
                balance: 0, // số dư ví mặc định là 0
            }
            alert("Đăng ký thành công");
            window.location.href = "../../client/login.html";

            // Thêm user vào Firestore
            // db.collection("users").add(userData)
            //     .then((docRef) => {
            //         alert("Đăng ký thành công");
            //         window.location.href = "/login.html";
            //         console.log("Document written with ID: ", docRef.id);
            //     })
            //     .catch((error) => {
            //         alert("Đăng ký thất bại");
            //         console.error("Error adding document: ", error);
            //     });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            alert(`Xay ra loi dang ky, vui long thu lai.`);
            console.log(errorMessage);
        });
}

// them lang nghe su kien submit thi chay ham handleRegister cho form co class la register-form
document.querySelector(".register-form").addEventListener("submit", handleRegister);

 
// Luong dang ky: nhan nut dang ky thi chay ham xu ly dang ky (them xu ly lang nghe xu kien nhan nut) 
// -> Lay thong tin
// -> kiem tra thong tin dang ky hop le hay khong (email hop le, mat khau phai it nhat 6 ky tu...)
// -> goi ham dang ky cua Firebase Authentication
// -> xu ly dang ky thanh cong
// -> xu ly dang ky that bai