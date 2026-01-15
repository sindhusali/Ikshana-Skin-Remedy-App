import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // ✅ Load user from localStorage when app starts
    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
        if (token && id) {
            setUser({ token, id });
        }
    }, []);

    function login(userData) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData.id);
        setUser({ token: userData.token, id: userData.id });

        // ✅ Ensure React detects the state change
        window.dispatchEvent(new Event("storage"));
    }

    function logout(navigate) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        window.dispatchEvent(new Event("storage")); // ✅ Force update
        if (navigate) {
            navigate("/");
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
