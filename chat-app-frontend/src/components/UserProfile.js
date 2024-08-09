import React, { useEffect, useState } from 'react';

const UserProfile = ({ token }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            alert("Failed to fetch user!");
        }
        };

        fetchProfile();
    }, [token]);

    return (
        <div>
        {profile ? (
            <div>
            <h1>{profile.full_name}</h1>
            <img src={profile.image} alt={profile.full_name} style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            </div>
        ) : (
            <p>Loading...</p>
        )}
        </div>
    );
};

export default UserProfile;
