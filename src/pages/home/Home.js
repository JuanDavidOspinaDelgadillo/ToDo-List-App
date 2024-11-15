import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Button } from "@mui/material";
import '../home/Home.css'

const Home = () => {

    const navigate = useNavigate();

    const verifyAndDecodeToken = async () => {
        const user = getAuth().currentUser;
        if (user) {
            try {
                const token = await user.getIdToken();
                console.log("JWT:", token); 
                const decoded = jwtDecode(token);
                console.log("Decoded JWT:", decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.error("No user is logged in.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            console.log("User logged outd");
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    useEffect(() => {
        verifyAndDecodeToken();
    }, []);

    return (
        <div className="home-container">
            <h1>Welcome to home page!</h1>
            <Button
                className="button-logout"
                variant="contained"
                color="inherit"
                fullWidth
                onClick={handleLogout}
            >
                LogOut
            </Button>
        </div>
    )
}

export default Home;