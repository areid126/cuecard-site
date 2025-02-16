import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import app from '../../utils/axiosConfig';


// Make a component for changing username
const ChangeUsernameForm = ({ user, setUser }) => {
    const [username, setUsername] = useState(user.username);
    const [error, setError] = useState(undefined);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username) return setError("Please enter a username.");
        if (username === user.username) return setError("New username matches old username.");
        if (!/\w/.test(username)) return setError("Username must contain only letters, numbers, and underscores.");
        
        // Update the user's username if it is valid
        try {
            // Change the user's email
            const res = await app.patch(`/api/user`, { username: username });
            if (res.data) {
                setUser(res.data); // Update the user's details
                setError(undefined); // Remove error after success
            }
            
        } catch (err) {
            // Disply appropriate error messages to the user
            if (err.status === 409) setError("Username taken.");
            else setError("Unexpected error. Please try again.");
        }

    }

    return (
        <fieldset className="flex flex-col bg-zinc-50 rounded-xl p-3 max-w-96 w-full items-center gap-4 shadow">
            <h3 className="text-xl font-semibold">Change Username</h3>
            <form className="w-full flex flex-col items-center gap-1" onSubmit={handleSubmit}>
                <input className="self-start w-full bg-white outline-none focus:ring-2 ring-indigo-600 ring-offset-2 border border-zinc-100 rounded-md p-2 grow-1"
                    id="username" type="text" onChange={(e) => setUsername(e.target.value)} placeholder="username123" />
                <label className="self-start font-semibold uppercase text-sm text-zinc-500" htmlFor="username">New Username</label>
                <p className="text-rose-700">{error}</p>
                <input className="self-end hover:opacity-[0.9] text-white font-semibold bg-indigo-600 pb-2 pt-1 px-2 rounded-xl cursor-pointer" value="Change Username" type="submit" />
            </form>
        </fieldset>
    );
}


// Make a component for changing password
const ChangePasswordForm = () => {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState(undefined);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password1 !== password2) return setError("Passwords do not match.");
        // Check that the password is of the correct form
        if (password1.length <= 8 || !/[a-z]+/.test(password1) || !/[A-Z]+/.test(password1)
            || !/\d/.test(password1) || !/\W/.test(password1))
            return setError("Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.");

        // Update the password if it is valid
        try {
            // Only changing password so the user's information in the application should remain the same
            await app.patch(`/api/user`, { password: password1 });
            setError(undefined); // Remove error after success
        } catch (err) {
            setError("Unexpected error. Please try again.");
        }
        
    }

    return (
        <fieldset className="flex flex-col bg-zinc-50 rounded-xl p-3 max-w-96 w-full items-center gap-4 shadow">
            <h3 className="text-xl font-semibold">Change Password</h3>
            <form className="w-full flex flex-col items-center gap-1" onSubmit={handleSubmit}>
                <input className="self-start w-full bg-white outline-none focus:ring-2 ring-indigo-600 ring-offset-2 border border-zinc-100 rounded-md p-2 grow-1"
                    id="password" type="password" onChange={(e) => setPassword1(e.target.value)} placeholder="Password01!" />
                <label className="self-start font-semibold uppercase text-sm text-zinc-500" htmlFor="password">New Password</label> 
                <input className="self-start w-full bg-white outline-none focus:ring-2 ring-indigo-600 ring-offset-2 border border-zinc-100 rounded-md p-2 grow-1"
                    id="password" type="password" onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm Password" />
                <label className="self-start font-semibold uppercase text-sm text-zinc-500" htmlFor="password"> Confirm Password</label>
                <p className="text-rose-700">{error}</p>
                <input className="self-end hover:opacity-[0.9] text-white font-semibold bg-indigo-600 pb-2 pt-1 px-2 rounded-xl cursor-pointer" value="Change Password" type="submit" />
            </form>
        </fieldset>
    );
}

const Account = ({ user, setUser }) => {
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const navigate = useNavigate();

    // Deleting account
    const handleDelete = async () => {
        const result = confirm("Are you sure you want to delete this account?");
        if (!result) return;

        // Delete the user's account
        try {
            const res = await app.delete(`/api/user`);
            if (res) {
                setUser(undefined);
                navigate('/register');
            }
        } catch (err) {
            // Do nothing if there is an error
        }
    };

    useEffect(() => {

        // Give the user time to load in
        setTimeout(() => {
            if (userLoading) setUserLoading(false);
            if (!userLoading && !user) navigate("/login");
        }, 750);

        // Only stop loading if there is a user
        if(user) setLoading(false);
    }, [userLoading, user]);

    // If the user it not logged in make them login
    if (loading) return (
        <section className="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" className="h-48 opacity-[0.2]"></img>
        </section>
    );

    return (
        <section className="min-h-[87vh] mx-56 pt-14 flex flex-col px-2 items-center gap-4">
                <h2 className="text-3xl font-semibold">Edit <span className="text-indigo-600">{user.username}</span>'s Details</h2>
                <ChangeUsernameForm user={user} setUser={setUser} />
                <ChangePasswordForm />
                <button className="hover:opacity-[0.8] text-white bg-rose-600 text-2xl pb-3 pt-2 px-5 rounded-xl cursor-pointer shadow hover:drop-shadow-1"
                    onClick={handleDelete} >Delete Account</button>
            
        </section>
    );
};


export default Account;
