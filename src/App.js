import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { MyContextProvider } from "./components/Mycontext";
import UpdatePost from "./components/Update";
import {Main} from "./components/Main";

function App() {
    return (
        <MyContextProvider>
            <Routes>
                <Route path="/" element={<Home/>}>
                    <Route path="login" element={<Login/>} />
                    <Route path="main" element={<Main/>} />
                    <Route path="edit/:id" element={<UpdatePost/>} />
                </Route>
                <Route path="register" element={<Register/>} />
            </Routes>
        </MyContextProvider>
    );
}

export default App;
