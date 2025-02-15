import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'
import app from '../../utils/axiosConfig'

const Set = ({set}) => {
    return (
        <li class="text-zinc-500 bg-zinc-100 shadow rounded-xl h-24 hover:drop-shadow-sm">
            <NavLink to={`/my/set/${set.id}`} className="overflow-hidden w-full h-full flex flex-col">
                <div class="flex flex-row items-center justify-between text-ellipsis overflow-hidden">
                    <h2 class="text-zinc-800 text-xl p-2 truncate font-bold" title={set.title}>{set.title}</h2>
                    <p class="rounded-full bg-indigo-200 w-fit h-fit px-3 text-indigo-500 pb-1 text-sm mx-2 text-nowrap shrink-0">{`${set.count} ${set.count === 1 ? "card" : "cards"}`}</p>
                </div>
                <p class="mx-2 truncate">{set.description}</p>
            </NavLink>
        </li>
    );
}

const Folder = ({folder}) => {
    return (
        <li class="bg-zinc-100 shadow rounded-xl h-24 hover:drop-shadow-sm">
            <NavLink to={`/my/folder/${folder.id}`} className="overflow-hidden flex flex-col w-full h-full">
                <h2 class="text-zinc-800 text-xl p-2 truncate font-bold" title={folder.title}>{folder.title}</h2>
                <p class="rounded-full bg-indigo-200 w-fit px-3 text-indigo-500 pb-1 text-sm ml-2 text-nowrap">{`${folder.count} ${folder.count === 1 ? "set" : "sets"}`}</p>
            </NavLink>
        </li>
    );
}


const Home = ({ user }) => {
    const [sets, setSets] = useState([]);
    const [folders, setFolders] = useState([]);

    // Only get the user's sets if there is a user
    useEffect(() => {
        const getContent = async () => {
            try {
                // Get the sets (limit to 12)
                const res = await app.get("/api/set?limit=12");
                if (res) setSets(res.data);

                // Get the folders (limit to 12)
                const res2 = await app.get("/api/folder?limit=12");
                if (res2) setFolders(res2.data);
            } catch (err) {
                // Do nothing if there are no sets
            }
        }

        // If there is a user get their sets
        if(user) getContent();
    }, [user]);

    // If there is no user then tell the user to login to start studying
    if(!user) return (
        <section class="min-h-[87vh] m-auto flex flex-col items-center justify-center">
            <img src="/NoGPS.svg" class="h-96 grayscale"></img>
            <p class="text-2xl text-zinc-700 pb-9">Login to start studying</p>
            <button class="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to="/login">Login</NavLink></button>
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
                    <ul class="grid grid-cols-4 gap-3">
                        {sets.map((set, i) => <Set set={set} key={i} />)}
                    </ul>
                </>
            }
            {folders && folders.length > 0 &&
                <>
                    <div class="flex gap-4 items-end p-5">
                        <h1 class="text-2xl">Folders</h1>
                        <p class="text-indigo-600 hover:underline"><NavLink to="/my/folder">{"View More >"}</NavLink></p>
                    </div>
                    <ul class="grid grid-cols-4 gap-3">
                        {folders.map((folder, i) => <Folder folder={folder} key={i} />)}
                    </ul>
                </>
            }
        </section>
    );
}

export default Home