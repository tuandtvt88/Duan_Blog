import { Field, Form, Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Register.css';  // Importing the CSS file

function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                onSubmit={values => {
                    axios.post('http://localhost:3000/register', values)
                        .then(res => {
                            alert('Đăng ký thành công');
                            navigate('/login');
                        })
                        .catch(err => {
                            if (err.response && err.response.status === 400) {
                                setErrorMessage('Tài khoản đã được đăng ký rồi, bạn hãy tạo tài khoản mới.');
                            } else {
                                setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại sau.');
                            }
                        });
                }}
            >
                <Form className="register-form">
                    <Field name="username" className="form-input" placeholder="Username" />
                    <Field name="password" type="password" className="form-input" placeholder="Password" />
                    <button type="submit" className="submit-button">Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Register;
