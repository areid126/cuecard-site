import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import app from '../../utils/axiosConfig'


const Login = ({ setUser, user }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        // Prevent the default behaviour
        event.preventDefault();

        // Error if either the username or password are missing
        if (!username || !password) return setError('Enter both a username and a password.');

        try {
            const res = await app.post('/api/auth/login', { username: username, password: password });
            if (res) {
                setUser(res.data);
                navigate('/');
            }
        } catch (err) {
            // If there is any error display error messages to the user
            if (err.response.status === 401) setError('Invalid username or password.');
            else setError("Unexpected error. Please try again.");
        }
    }

    return (
        <UserForm handleSubmit={handleSubmit} setPassword={setPassword} setUsername={setUsername} 
            error={error} title="Login" alt="Register" user={user} setUser={setUser}/>
    );
}

export default Login;