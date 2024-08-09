import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = ({ token }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/v1/user/users/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            alert("Failed to fetch users!");
        }
        };

        fetchUsers();
    }, [token]);

    return (
        <div>
        <h2>User List</h2>
        <ul>
            {users.map((user) => (
            <li key={user.id}>
                {user.username} - {user.email} <Link to={`/chat/${user.id}`}>Chat</Link>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default UserList;
