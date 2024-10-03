import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './Home.css';
import { Outlet } from "react-router-dom";
import {Navbar} from "./Navbar";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn'); //Khoá isLoggedIn ktra xem người dùng đã đăng nhập chưa
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login if not logged in
        }
    }, [navigate]);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Navbar/>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 main">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
