
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const loginForm = document.querySelector(".login-form");

const now = new Date().getTime();

if (true) {
    window.location.href = "../../client/index.html";
}


function handleLogin(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    let email = inpEmail.value;
    let password = inpPwd.value;

    // Kiểm tra các trường có trống không
    if (!email || !password) {
        alert("Vui lòng điền đủ các trường");
        return;
    }

    // Đăng nhập với Firebase Auth
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            alert("Đăng nhập thành công");
            
            // Thiết lập phiên hoặc lưu thông tin đăng nhập
            // Tạo đối tượng user session
            const userSession = {
                user: user,
                expiry: new Date().getTime() + 2 * 60 * 60 * 1000 // 2 tiếng
            };
            // Lưu vào localStorage
            localStorage.setItem('user_session', JSON.stringify(userSession));
            // Chuyển hướng tới trang chủ
            window.location.href = "../../client/index.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Email hoặc mật khẩu không đúng");
        });

}

loginForm.addEventListener("submit", handleLogin);
