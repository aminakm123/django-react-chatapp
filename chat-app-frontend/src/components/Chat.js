import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Chat.css"; // Import the CSS file for chat styling

const Chat = ({ token }) => {
    const { userId } = useParams(); // Get the logged-in user ID from the URL params
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [ws, setWs] = useState(null);

    // Fetch the list of users (you can keep this if you want to show other users in the chat interface)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/user/users/", {
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
        const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userId}/`);
        
        websocket.onopen = () => {
            console.log("WebSocket connection established");
        };
    
        websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    
        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        };
    
        setWs(websocket);
    
        // Fetch messages for the logged-in user
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/user/chat/messages/${userId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched messages:", response.data); 
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
    
        fetchMessages();
    
        // Close the WebSocket connection when the component unmounts
        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [token, userId]);
    

    const handleSendMessage = (event) => {
        event.preventDefault();

        if (newMessage.trim() !== "" && ws) {
            const messageData = {
                message: newMessage,
                recipient_id: userId,
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
                            className={user.id === parseInt(userId) ? "active" : ""}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-box">
                <h2>Chat with {users.find((user) => user.id === parseInt(userId))?.username}</h2>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === userId ? "sent" : "received"}`}>
                            <strong>{message.sender}:</strong> {message.message || message.content || message.text}
                        </div>
                    ))}
                </div>

                <form className="send-message" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        name="message"
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
