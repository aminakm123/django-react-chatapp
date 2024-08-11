import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Register.css";

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/user/token/", formData);
            const accessToken = response.data.access;
            setToken(accessToken);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refresh", response.data.refresh);

            // Fetch the logged-in user's ID
            const userResponse = await axios.get("http://127.0.0.1:8000/api/v1/user/profile/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userId = userResponse.data.id; // Assuming the user ID is in the response data
            navigate(`/chat/${userId}`); // Redirect to the chat page with the user's ID
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed!");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
