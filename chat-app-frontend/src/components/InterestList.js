import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InterestList = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [interests, setInterests] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/user/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        const fetchInterests = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/user/interests/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Interests data:', response.data); // Log to check data
                setInterests(response.data);
            } catch (error) {
                console.error('Failed to fetch interests:', error);
            }
        };

        fetchUsers();
        fetchInterests();
    }, [token]);

    const handleSendInterest = async (email) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/v1/user/interests/', {
                recipient_email: email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Interest sent!');
        } catch (error) {
            console.error('Failed to send interest:', error);
            alert('Failed to send interest.');
        }
    };

    const handleAcceptInterest = async (id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/user/interests/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Interest accepted!');
            // Refresh interests
            const response = await axios.get('http://127.0.0.1:8000/api/v1/user/interests/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInterests(response.data);
        } catch (error) {
            console.error('Failed to accept interest:', error);
            alert('Failed to accept interest.');
        }
    };

    const handleRejectInterest = async (id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/user/interests/${id}/reject/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Interest rejected!');
            // Refresh interests
            const response = await axios.get('http://127.0.0.1:8000/api/v1/user/interests/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInterests(response.data);
        } catch (error) {
            console.error('Failed to reject interest:', error);
            alert('Failed to reject interest.');
        }
    };

    return (
        <div>
            <h2>Send Interest</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                        <button onClick={() => handleSendInterest(user.email)}>Send Interest</button>
                    </li>
                ))}
            </ul>

            <h2>My Interests</h2>
            <ul>
                {interests.map((interest) => (
                    <li key={interest.id}>
                        {interest.recipient_profile ? interest.recipient_profile.full_name : 'No Name Available'} - {interest.status}
                        {interest.status === 'pending' && (
                            <>
                                <button onClick={() => handleAcceptInterest(interest.id)}>Accept</button>
                                <button onClick={() => handleRejectInterest(interest.id)}>Reject</button>
                            </>
                        )}
                        {interest.status === 'accepted' && (
                            <Link to={`/chat/${interest.recipient}`}>Chat</Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InterestList;
