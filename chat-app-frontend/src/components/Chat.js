import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Chat.css"; // Import the CSS file for chat styling

const Chat = ({ token }) => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(userId);
    const [ws, setWs] = useState(null);

    // Fetch the list of users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/user/users/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [token]);

    // Handle WebSocket connection
    useEffect(() => {
        if (selectedUser) {
            const websocket = new WebSocket(`ws://localhost:8000/ws/chat/${selectedUser}/`);
            setWs(websocket);

            // Fetch messages for the selected user
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/v1/user/chat/messages/${selectedUser}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            };

            fetchMessages();

            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            // Close the WebSocket connection when the component unmounts or when the selected user changes
            return () => {
                if (websocket) {
                    websocket.close();
                }
            };
        }
    }, [token, selectedUser]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "" && ws) {
            const messageData = {
                content: newMessage,
                recipient: selectedUser,
            };

            ws.send(JSON.stringify(messageData));
            setNewMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="user-list">
                <h2>Users</h2>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => setSelectedUser(user.id)}
                            className={user.id === selectedUser ? "active" : ""}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-box">
                <h2>Chat with {users.find((user) => user.id === selectedUser)?.username}</h2>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === userId ? "sent" : "received"}`}>
                            <strong>{message.sender}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                <div className="send-message">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
