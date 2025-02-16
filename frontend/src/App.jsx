import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import app from './utils/axiosConfig'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Login/Register'
import Account from './components/Account/Account'
import Study from './components/Study/Study'
import MyCards from './components/MyCards/MyCards'
import MySets from './components/MyCards/MySets'
import MyFolders from './components/MyCards/MyFolders'
import Set from './components/MyCards/Set'
import CreateSet from './components/NewSet/CreateSet'
import EditSet from './components/NewSet/EditSet'



// Function that compiles application
const App = () => {

    // Add state for the current user
    const [user, setUser] = useState(undefined);

    // At the start of the application check if the user is already logged in (so the user remains logged in between refreshes)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await app.get("/api/auth/verify");
                if (res.data) setUser(res.data);
            } catch (err) {
                // Do nothing if there is no user
            }
        }

        getUser();
    }, []);

    return (
        <Router>
            <Header user={user} setUser={setUser} />

            {/* Set up all the routes for the router */}
            <Routes>
                {/* Route to the homepage */}
                <Route path="/" element={<Home user={user} />} />

                {/* Routes relating to the current user's account */}
                <Route path="/login" element={<Login setUser={setUser} user={user} />} />
                <Route path="/register" element={<Register setUser={setUser} user={user} />} />
                <Route path="/account" element={<Account setUser={setUser} user={user} />} />

                {/* Routes for looking at the user's cards */}
                <Route path="/my" element={<MyCards user={user} />} /> {/* Look at sets and folders */}

                {/* Need their own components */}
                <Route path="/my/set" element={<MySets user={user} />} /> {/* Look at sets */}
                <Route path="/my/folder" element={<MyFolders user={user} />} /> {/* Look at folders */}
                <Route path="/my/set/:id" element={<Set user={user} />} /> {/* Look at a specific set */}
                <Route path="/my/folder/:id" element={<MyCards user={user} />} /> {/* Look at a specific folder */}

                {/* Routes for interacting with the user's cards */}
                <Route path="/new" element={<CreateSet user={user} />} /> {/* Create a set */}
                <Route path="/study" element={<Study user={user} />} /> {/* Study a collection of cards */}
                <Route path="/edit/:id" element={<EditSet user={user} />} /> {/* Edit a specific set */}
            </Routes>

            <Footer />
        </Router>
    );
}

export default App
