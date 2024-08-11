import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [interests, setInterests] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUserProfile = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/user/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.email) {
                    setCurrentUserEmail(response.data.email); // Set current user email
                }
            } catch (error) {
                console.error("Failed to fetch current user profile:", error);
            }
        };

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

        const fetchInterests = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/user/interests/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInterests(response.data);
            } catch (error) {
                console.error("Failed to fetch interests:", error);
            }
        };

        fetchCurrentUserProfile();
        fetchUsers();
        fetchInterests();
    }, [token]);

    const handleSendInterest = async (email) => {
        try {
            setLoading(true); // Set loading to true
            const response = await axios.post("http://127.0.0.1:8000/api/v1/user/interests/", {
                recipient_email: email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 201) {
                alert("Interest sent!");
                // Optimistically update the interests state
                setInterests([...interests, { recipient_email: email, status: 'pending' }]);
            } else {
                console.error("Failed to send interest:", response.data);
                alert("Failed to send interest.");
            }
        } catch (error) {
            console.error("Error while sending interest:", error.response);
            if (error.response && error.response.data) {
                alert("Failed to send interest. Error: " + JSON.stringify(error.response.data));
            } else {
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const hasInterest = (email) => {
        return interests.some(interest => interest.recipient_email === email && interest.status === 'pending');
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users
                    .filter(user => user.email !== currentUserEmail) // Filter out the current user
                    .map((user) => (
                        <li key={user.id}>
                            {user.username} - {user.email}
                            {hasInterest(user.email) ? (
                                <button>Waiting for Approval</button> 
                            ) : (
                                <button onClick={() => handleSendInterest(user.email)} disabled={loading}>
                                    {loading ? "Sending..." : "Send Interest"}
                                </button>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default UserList;
