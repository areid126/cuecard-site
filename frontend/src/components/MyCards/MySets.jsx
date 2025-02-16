import { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import app from '../../utils/axiosConfig'
import SetList from "./SetList";

const MySets = ({user}) => {
    const [sets, setSets] = useState([]);
    const [userLoading, setUserLoading] = useState([]); // Specifically gives time for the user to load
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    // Only get the user's sets if there is a user
    useEffect(() => {

        const getContent = async () => {
            // Get the query parameters
            const query = new URLSearchParams(location.search);
            let page = parseInt(query.get("page"));
            let limit = parseInt(query.get("limit"));
    
            if(!limit || limit < 1) limit = 30;
            if(!page || page < 1) page = 1;
            setPage(page);

            try {
                // Get the sets (limit to 30)
                const res = await app.get(`/api/set?limit=${limit}&offset=${limit*(page - 1)}`);
                if (res) {

                    // Get the number of cards in each set
                    await Promise.all(res.data.results.map(async set => {
                        return new Promise(async (resolve, reject) => {
                            const cardRes = await app.get(`/api/card?s=${set.id}`);
                            set.count = cardRes.data.length;
                            return resolve(set); // Return the set with its cards
                        });
                    }));

                    // Process the previous and next fields
                    if(res.data.prev) res.data.prev = `/my/set?page=${page-1}&limit=${limit}`;
                    if(res.data.next) res.data.next = `/my/set?page=${page+1}&limit=${limit}`;

                    setSets(res.data);
                } 
                
            } catch (err) {
                // Do nothing if it errors
            }

            // Scroll to the top after getting the sets
            setLoading(false);
            window.scrollTo(0, 0);
        }

        // If the user is logged in then get their sets
        if(user) getContent();

        // Otherwise wait for the user to load before redirecting to the login page
        else setTimeout(() => {
            if (userLoading) setUserLoading(false); // Give the user the opportunity to load in
            if (!userLoading && !user) navigate("/login");
        }, 750);

    }, [userLoading, user, location.search]);

    // If the user is not logged in immediately then load the page
    if (loading) return (
        <section className="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" className="h-48 opacity-[0.2]"></img>
        </section>
    );

    // If there is no sets then tell the user to create a set
    if(!sets || !sets.results || sets.count === 0) return (
        <section className="min-h-[87vh] m-auto flex flex-col items-center justify-center">
            <img src="/NoDocuments.svg" className="h-96 grayscale"></img>
            <p className="text-2xl text-zinc-700 pb-9">Create a set to start studying</p>
            <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to="/new">Create Set</NavLink></button>
        </section>
    );

    // If the user is logged in and has sets then display a list of them to the user
    return (
        <section className="min-h-[87vh] mx-56 pt-14 flex flex-col px-2">
            {sets && sets.count > 0 &&
                <>
                    <div className="flex gap-4 items-end p-5">
                        <h1 className="text-2xl">Sets</h1>
                        <p className="text-indigo-600">{`Page ${page} >`}</p>
                    </div>
                    <SetList sets={sets.results} />
                </>
            }
            <div className="my-5 flex flex-row w-full gap-10 justify-center">
                {sets && sets.prev &&
                    <button className="ml-10 pt-1 pb-2 px-3 rounded-sm bg-indigo-600 text-zinc-50  hover:opacity-[0.9]">
                        <NavLink to={sets.prev} >
                        <p>{"< prev"}</p>
                        </NavLink>
                    </button>
                }
                {sets && sets.next &&
                    <button className="mr-10 pt-1 pb-2 px-3 rounded-sm bg-indigo-600 text-zinc-50  hover:opacity-[0.9]">
                        <NavLink to={sets.next} >
                        <p>{"next >"}</p>
                        </NavLink>
                    </button>
                }
            </div>
        </section>
    );
}


export default MySets;