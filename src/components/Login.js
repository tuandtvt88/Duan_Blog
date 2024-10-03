import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "./Mycontext"; // Import context
import './Login.css'; // Import the CSS file

function Login() {
    const [usn, setUsn] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [forgotUsn, setForgotUsn] = useState(''); // State for forgot username
    const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle for showing forgot password section
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(MyContext); // Use setCurrentUser from context

    const getDataUsn = (event) => {
        setUsn(event.target.value);
    };

    const getDataPwd = (event) => {
        setPwd(event.target.value);
    };

    const getDataForgotUsn = (event) => {
        setForgotUsn(event.target.value);
    };

    const submit = () => {
        // Send login request to backend to validate credentials
        axios.post('http://localhost:3000/login', { username: usn, password: pwd })
            .then(res => {
                if (res.data.success) {
                    setCurrentUser({ username: usn }); // Update currentUser context with the username
                    localStorage.setItem('isLoggedIn', 'true');
                    navigate('/main');
                } else if (res.data.error === 'User not registered') {
                    setErrorMessage('Tài khoản bạn chưa đăng ký. Vui lòng đăng ký tài khoản mới.');
                } else {
                    setErrorMessage('Sai username hoặc password');
                }
            })
            .catch(err => {
                setErrorMessage('Sai username hoặc password');
            });
    };

    const resetPassword = () => {
        // Send reset password request to backend
        axios.post('http://localhost:3000/forgot-password', { username: forgotUsn })
            .then(res => {
                if (res.data.success) {
                    setErrorMessage('Mật khẩu đã được đặt lại thành mặc định. Vui lòng kiểm tra email của bạn hoặc thử đăng nhập với mật khẩu mới.');
                    setShowForgotPassword(false); // Hide the forgot password section
                } else {
                    setErrorMessage(res.data.error || 'Đã xảy ra lỗi, vui lòng thử lại sau.');
                }
            })
            .catch(err => {
                setErrorMessage('Tài khoản chưa đăng ký, bạn vui lòng đăng ký tài khoản mới');
            });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}
                <input type="text" placeholder="Username" value={usn} onChange={getDataUsn} />
                <input type="password" placeholder="Password" value={pwd} onChange={getDataPwd} />
                <button onClick={submit}>Submit</button>
                <p className="register-link">
                    Nếu bạn chưa có tài khoản, hãy <a href="/register">đăng ký tài khoản mới</a>.
                </p>
                <p className="forgot-password-link" onClick={() => setShowForgotPassword(!showForgotPassword)}>
                    Quên mật khẩu?
                </p>
                {showForgotPassword && (
                    <div className="forgot-password-form">
                        <input
                            type="text"
                            placeholder="Nhập username để đặt lại mật khẩu"
                            value={forgotUsn}
                            onChange={getDataForgotUsn}
                        />
                        <button onClick={resetPassword}>Đặt lại mật khẩu</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
