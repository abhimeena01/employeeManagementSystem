import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";


// 1. Create context
const UserContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(true)
  useEffect(() => {
    const verifyUser=async () =>{
        
        try{
            const token = localStorage.getItem('token')
            if(token){

            
        const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: {
           Authorization: `Bearer ${token}`
        }
       });

        console.log(response);
        if (response.data.success) {
        setUser(response.data.user);
        }
            }
            else{
                setUser(null);
                setLoading(false)
            }
        }catch(error){
            console.log(error)
            if(error.response && !error.response.data.error){
            setUser(null)
         }
        }finally{
            setLoading(false);
        }
    }
    verifyUser()
  },[])
  const login = (user, token) => {
  setUser(user);
  localStorage.setItem("token", token);
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout,loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Hook to use auth context
export const useAuth = () => useContext(UserContext);
export default AuthProvider