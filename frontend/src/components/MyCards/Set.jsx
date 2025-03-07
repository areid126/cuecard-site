import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import app from '../../utils/axiosConfig'
import CardList from "./CardList";

const Set = ({user}) => {
    const { id } = useParams(); // Get the id of the set being studied
    const [set, setSet] = useState(undefined);
    const [userLoading, setUserLoading] = useState(true); // Specifically gives time for the user to load
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Only get the user's sets if there is a user
    useEffect(() => {

        const getContent = async () => {

            try {
                // Get the set
                const res = await app.get(`/api/set/${id}`);
                if (res) setSet(res.data);

                // Get the set's cards
                const res2 = await app.get(`/api/card?s=${id}`);
                if(res2) setSet({...res.data, cards: res2.data});

            } catch (err) {
                // Do nothing if it errors
            }

            // Set loading to false after getting the set
            setLoading(false);
        }

        // If the user is logged in then get the set
        if(user) getContent();

        // Otherwise wait for the user to load before redirecting to the login page
        else setTimeout(() => {
            if (userLoading) setUserLoading(false); // Give the user the opportunity to load in
            if (!userLoading && !user) navigate("/login");
        }, 750);

    }, [ userLoading, user, location.search]);

    // Function for clicking delete
    const onDelete = async () => {
        try {
            const res = await app.delete(`/api/set/${id}`);
            if (res.status === 204) navigate("/my/set"); // Send the user back to the sets page
        } catch (err) {
            // Do nothing if the delete fails
        }
    }

    // Function for clicking star
    const onStar = async (card) => {
        // Update the star value
        const newSet = { ...set };
        newSet.cards[card].starred = !newSet.cards[card].starred;
        setSet(newSet); // Update the current set


        // Synchronise with the backend
        try {
            // If the card is currently starred then unstar it
            if (set.cards[card].starred) await app.patch("/api/card", {cards :[ {id: set.cards[card].id, starred: 1} ]});
            else await app.patch("/api/card", {cards :[ {id: set.cards[card].id, starred: -1} ]});
        } catch (err) {
            // Do nothing if it errors
        }
    }

    // If the user is not logged in immediately then load the page
    if (loading) return (
        <section className="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" className="h-48 opacity-[0.2]"></img>
        </section>
    );

    // If there is no set then tell the user to create a set
    if(!set || !set.cards) return (
        <section className="min-h-[87vh] m-auto flex flex-col items-center justify-center">
            <img src="/NoDocuments.svg" className="h-96 grayscale"></img>
            <p className="text-2xl text-zinc-700 pb-9">The requested set does not exist.</p>
            <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to="/my/set">View All</NavLink></button>
        </section>
    );

    // If the user is logged in and has sets then display a list of them to the user
    return (
        <section className="min-h-[87vh] mx-56 pt-14 flex flex-col px-2">        
            <div className="flex gap-4 items-end p-5 pb-0 justify-between">
                <div className="flex flex-row gap-4 items-end">
                    <h1 className="text-3xl font-semibold">{set.title}</h1>
                    <p className="pb-1 text-indigo-600">{`${set.cards.length} cards`}</p>
                </div>
                <nav className="flex flex-row gap-4 items-center">
                    <button className="pt-1 pb-2 px-3 rounded-sm bg-indigo-600 text-zinc-50  hover:opacity-[0.9] cursor-pointer">
                        <NavLink to={`/study?s=${id}`}>Study</NavLink>
                    </button>
                    <NavLink to={`/edit/${id}`} className="hover:opacity-[0.7]"><img className="h-8" src="/pencil-zinc-800.svg"></img></NavLink>
                    <button onClick={onDelete} className="cursor-pointer hover:opacity-[0.7]">
                        <img className="h-8" src="/delete-red-500.svg"></img>
                    </button>
                </nav>
            </div>
            <p className="text-zinc-600 pl-5 mb-6">{set.description}</p>
            <div className="flex justify-center w-full">
                {set.cards &&  set.cards.length > 0 ?
                    <CardList set={set} onStar={onStar}/>
                    :
                    <div className="flex flex-col items-center justify-center">
                        <img src="/NoDocuments.svg" className="h-96 grayscale"></img>
                        <p className="text-2xl text-zinc-700 pb-9">There are no cards in this set.</p>
                        <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to={`/edit/${id}`}>Edit Set</NavLink></button>
                    </div>
                }
            </div>
        </section>
    );
}


export default Set;