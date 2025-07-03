import React from "react";
import { useAuth } from "../../context/authContext"; // ✅ Import useAuth

const Navbar = () => {
    const { user,logout } = useAuth();

    return (
        <div className="flex justify-between h-12 bg-teal-600 px-5 items-center text-white">
            <p>Welcome, {user?.name || "Guest"}</p>
            <button className="px-4 py-1 bg-teal-700 hover:bg-teal-800" onClick={logout}>Logout</button>
        </div>
    );
};

export default Navbar;
