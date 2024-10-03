import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "./Mycontext"; // Import your context

export function Navbar() {
    const { currentUser, setCurrentUser } = useContext(MyContext); // Use context to get currentUser and setCurrentUser
    const navigate = useNavigate(); // Use navigate for redirection

    const handleLogout = () => {
        // Clear currentUser context and any login information stored (like localStorage)
        setCurrentUser(null);
        localStorage.removeItem('isLoggedIn'); // If you are using localStorage for login status
        navigate('/login'); // Redirect to the login page
    };

    const handleNavigation = (path) => {
        if (currentUser) {
            navigate(path);
        } else {
            alert('Vui lòng đăng nhập vào tài khoản để xem các bài đăng.');
        }
    };

    return (
        <div className="row">
            <div className="col-12">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <span
                                    className="nav-link"
                                    onClick={() => handleNavigation('/main')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Trang chủ
                                </span>
                            </li>
                            <li className="nav-item">
                                <span
                                    className="nav-link"
                                    onClick={() => handleNavigation('/main')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Blog
                                </span>
                            </li>
                        </ul>

                        <div className="form-inline my-2 my-lg-0">
                            {currentUser ? (
                                <>
                                    <span className="navbar-text mr-3">Xin chào {currentUser.username}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline-danger my-2 my-sm-0"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline-success my-2 my-sm-0">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-outline-success my-2 my-sm-0 ml-2">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
