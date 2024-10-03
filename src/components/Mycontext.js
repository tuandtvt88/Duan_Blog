import { createContext, useState } from "react";

// Create context
export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // State for logged-in user

    return (
        <MyContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </MyContext.Provider>
    );
};
