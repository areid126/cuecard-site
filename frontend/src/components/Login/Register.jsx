import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import app from '../../utils/axiosConfig'




const Register = ({ setUser, user }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password) return setError("Please provide a username and a password.");
        // Validate that the password is correct
        if (password.length <= 8 || !/[a-z]+/.test(password) || !/[A-Z]+/.test(password)
            || !/\d/.test(password) || !/\W/.test(password))
            return setError("Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
        if (!/\w/.test(username)) return setError("Username must contain only letters, numbers, and underscores.");

        try {
            const res = await app.post(`/api/auth/register`, {
                username: username,
                password: password
            });

            // Handle the response from backend
            if (res) {
                // Get the user's saved sets
                const res2 = await app.get(`/api/user/save`);
                if (res2) res.data.saves = res2.data;
                else res.data.saves = [];

                // Update the user
                setUser(res.data);
                navigate("/");
            }
        } catch (err) {
            if (err.response.status === 409) setError("Username taken.");
            else setError("Unexpected error. Please try again.");
        }
    };

    return (
        <UserForm handleSubmit={handleSubmit} setPassword={setPassword} setUsername={setUsername} 
            error={error} title="Register" user={user} alt="Login" setUser={setUser}/>
    );
};

export default Register
