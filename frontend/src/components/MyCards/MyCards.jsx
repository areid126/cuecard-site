import { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import app from '../../utils/axiosConfig'
import SetList from "./SetList";
import FolderList from "./FolderList";

const MyCards = ({user}) => {
    const [sets, setSets] = useState([]);
    const [folders, setFolders] = useState([]);
    const [userLoading, setUserLoading] = useState([]); // Specifically gives time for the user to load
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Only get the user's sets if there is a user
    useEffect(() => {

        const getContent = async () => {
            try {
                // Get the sets (limit to 10)
                const res = await app.get("/api/set?limit=10");
                if (res) setSets(res.data);

                // Get the folders (limit to 10)
                const res2 = await app.get("/api/folder?limit=10");
                if (res2) setFolders(res2.data);

            } catch (err) {
                // Do nothing if it errors
            }

            // Stop loading
            setLoading(false);
        }

        // If the user is logged in then get their sets
        if(user) getContent();

        // Otherwise wait for the user to load before redirecting to the login page
        else setTimeout(() => {
            if (userLoading) setUserLoading(false); // Give the user the opportunity to load in
            if (!userLoading && !user) navigate("/login");
        }, 750);

    }, [userLoading, user]);

    // If the user is not logged in immediately then load the page
    if (loading) return (
        <section class="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" class="h-48 opacity-[0.2]"></img>
        </section>
    );

    // If there is no sets then tell the user to create a set
    if(!sets || sets.length === 0) return (
        <section class="min-h-[87vh] m-auto flex flex-col items-center justify-center">
            <img src="/NoDocuments.svg" class="h-96 grayscale"></img>
            <p class="text-2xl text-zinc-700 pb-9">Create a set to start studying</p>
            <button class="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to="/new">Create Set</NavLink></button>
        </section>
    );

    // If the user is logged in and has sets then display a list of them to the user
    return (
        <section class="min-h-[87vh] mx-56 pt-14 flex flex-col px-2">
            {sets && sets.length > 0 &&
                <>
                    <div class="flex gap-4 items-end p-5">
                        <h1 class="text-2xl">Sets</h1>
                        <p class="text-indigo-600 hover:underline"><NavLink to="/my/set">{"View More >"}</NavLink></p>
                    </div>
                    <SetList sets={sets} />
                </>
            }
            {folders && folders.length > 0 &&
                <>
                    <div class="flex gap-4 items-end p-5">
                        <h1 class="text-2xl">Folders</h1>
                        <p class="text-indigo-600 hover:underline"><NavLink to="/my/folder">{"View More >"}</NavLink></p>
                    </div>
                    <FolderList folders={folders} />
                </>
            }
        </section>
    );
}


export default MyCards;