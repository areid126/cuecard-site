import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import app from '../../utils/axiosConfig';

// Function for shuffling the cards (works inplace)
const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Component for page to actually study cards
const Study = ({user}) => {
    const [cards, setCards] = useState(undefined); // All the cards being studied
    const [term, setTerm] = useState(true); // Whether the term or definition is showing for the current card
    const [card, setCard] = useState(0); // Counter for the current card
    const [end, setEnd] = useState(false);

    // State for applying operations
    const [originalCards, setOriginalCards] = useState(undefined); // The original unshuffled, unstarred cards

    // State for storing the results of the run through
    const [results, setResults] = useState([]);

    // Used as options for the user
    const [starred, setStarred] = useState(false); // Indicates whether the current cards are filtered to be starred
    const [shuffled, setShuffled] = useState(false); // Indicates whether the current cards are shuffled
    const [front, setFront] = useState(true); // True when the front is the term. false otherwise

    // Used to load the page
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);

    // Used to get the number of cards the user wants to study from the set/folder
    const [custom, setCustom] = useState(false);
    const [limit, setLimit] = useState(0);
    const [getLimit, setGetLimit] = useState(-1);

    const navigate = useNavigate(); // Used to navigate between pages


    // State for animating card flip
    const [isAnimating, setIsAnimating] = useState(false);

    // Animation for the card
    const AnimateCard = {
        initial: false,
        animate: {
            rotateY: !term ? 180 : 360
        },
        transition: {
            duration: 0.6,
            animationDirection: "normal"
        },
        onAnimationComplete: () => setIsAnimating(false)
    }

    const handleFlip = () => {
        if(!isAnimating) {
            setTerm(!term);
            setIsAnimating(true);
        }
    }

    // Use an effect to get the set to study
    useEffect(() => {

        // If there is no user try to load the user
        if(!user) setTimeout(() => {
            if (userLoading) setUserLoading(false); // Give the user the opportunity to load in
            if (!userLoading && !user) navigate("/login");
        }, 750);

        // Wait for the user to specify a limit before getting the cards
        if(limit === 0) return;

        const getCards = async () => {

            // Work out what cards to get
            const query = new URLSearchParams(location.search);
            let s = query.get("s"); // The requested set
            let f = query.get("f"); // The requested folder

            try {
                // Get the requested card
                const res = await app.get(`/api/card?sm=true&${(s && !f)? `s=${s}`: ""}${(!s && f)? `f=${f}`: ""}${(limit && limit > 0)? `&l=${limit}`: ""}`);

                // If there are cards then set the cards to be them
                if (res) {
                    setCards(res.data);
                    setOriginalCards(res.data);
                }
            } catch (err) {
                // Do nothing if it errors
            } finally {
                // whether there are sets or not stop loading
                setLoading(false);
            }
        }

        // If there is a user, get the cards
        if(user) getCards();
    }, [user, userLoading, limit]);

    const restart = () => {
        setCard(0);
        setTerm(front);
        setEnd(false);
    }

    const onStarClick = async () => {
        // Update the star value
        let newCards = [...cards];
        newCards[card].starred = !newCards[card].starred;
        setCards(newCards);

        // Synchronise with the backend
        try {
            // If the card is currently starred then unstar it
            if (cards[card].starred) await app.patch("/api/card", {cards :[ {id: cards[card].id, starred: 1} ]});
            else await app.patch("/api/card", {cards :[ {id: cards[card].id, starred: -1} ]});
        } catch (err) {
            // Do nothing if it errors
        }
    }

    // Function for moving onto the next card
    const onNext = async (known) => {
        const newResults = [...results, {id: cards[card].id, known: (known) ? 1 : -1}];
        setResults(newResults);

        // If it is the end of the cards then set the end to be true
        if(card + 1 >= cards.length) {
            setEnd(true);

            // Post the results to the database
            try {
                // If the card is currently starred then unstar it
                await app.patch("/api/card", {cards : results});

            } catch (err) {
                // Do nothing if it errors
            }
        }

        // Otherwise move to the next card
        else {
            setTerm(front);
            setCard(card + 1);
        }
    }

    // Function for undoing
    const onUndo = () => {
        // Remove the previous result
        if(results.length > 0) setResults([...results].slice(0, results.length - 1));
        // Go back one card
        if(card > 0) {
            setTerm(front);
            setCard(card - 1);
        }
    }

    const onFilter = async () => {
        let newCards;

        // Starring and the cards are (not) shuffled
        if(!starred) newCards = [...cards].filter(card => card.starred === true);
        // Unstarring and the cards are not shuffled
        if(starred && !shuffled) newCards = [...originalCards];
        // Unstarring and the cards are shuffled
        if(starred && shuffled) newCards = shuffle([...originalCards]);

        // Do nothing if there are on starred cards
        if(newCards.length === 0) return;

        // Update the cards
        setCards(newCards);
        restart();
        setStarred(!starred);
    }

    const onShuffle = async () => {
        let newCards;

        // Shuffling and (not) starred
        if(!shuffled) newCards = shuffle([...cards]);
        // Unshuffling and not starred
        if(shuffled && !starred) newCards = [...originalCards];
        // Unshuffling and starred
        if(shuffled && starred) newCards = [...originalCards].filter(card => card.starred === true);

        // Update the cards
        setCards(newCards);
        restart();
        setShuffled(!shuffled);
    }

    // Prompt the user for a limit to the number of cards to study
    if(limit === 0) return (
        <section className="min-h-[87vh] mx-56 pt-14 flex flex-col px-2 items-center justify-center"> 
            <p className="text-2xl text-zinc-700 pb-6">How many cards do you want to study?</p>
            <div className="flex flex-row gap-7 items-center">
                <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl cursor-pointer"
                    onClick={() => setLimit(-1)}>Study All</button>
                <p className="text-2xl text-zinc-700 pb-2">or</p>
                <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl cursor-pointer"
                    onClick={() => setCustom(true)}>Custom Amount</button>
            </div>
            {custom &&
                <div className="mt-6 flex flex-row gap-6">
                    <input className="w-24 bg-zinc-100 p-2 rounded-sm outline-none focus:shadow text-zinc-800" 
                        onChange={(e) => setGetLimit(e.target.value)} type="number" min="1" placeholder="Amount"></input>      
                    <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-lg pb-2 pt-1 px-3 rounded-sm cursor-pointer"
                        onClick={() => setLimit(getLimit)}>Save</button>
                </div>
            }
        </section>
    );

    // If it is loading then display the loading screen
    if (loading) return (
        <section className="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" className="h-48 opacity-[0.2]"></img>
        </section>
    );

    // If there are no cards then display a message to the user
    if (!cards || cards.length < 1) return (
        <section className="min-h-[87vh] px-56 flex flex-col items-center justify-center pt-14 text-zinc-800">
            <img src="/NoSearchResult.svg" className="h-96 grayscale"></img>
            <p className="text-2xl text-zinc-700 pb-9">There are no cards to study.</p>
            <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to={`/my`}>View All Sets</NavLink></button>
        </section>
    );

    // If the end of the cards is reached display a message to the user
    if (end) return (
        <section className="min-h-[87vh] px-56 flex flex-col items-center justify-center pt-14 text-zinc-800">
            <img src="/Done.svg" className="h-96 grayscale"></img>
            <p className="text-2xl text-zinc-700 pb-9">You have reached the end of the cards.</p>
            <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl cursor-pointer"
                onClick={restart} >Restart</button>
        </section>
    );

    return (
        <section className="min-h-[87vh] mx-56 pt-14 flex flex-col px-2 justify-center items-center gap-6">
            <p>{`${card + 1}/${cards.length}`}</p>
            <AnimatePresence>
                <motion.div {...AnimateCard}
                    className="transform-3d relative bg-zinc-100 rounded-xl flex flex-col items-center justify-center h-[60vh] max-w-[1000px] w-full">
                    <img className="z-5 absolute top-4 right-4 h-7 cursor-pointer self-end justify-self-start" 
                        onClick={onStarClick} src={cards[card].starred ? "/star-amber-200.svg" : "/star-zinc-800.svg"}></img>
                    <div onClick={handleFlip} className="h-full w-full absolute z-4"></div>
                    <>
                        {cards[card].term.file ? 
                            <img className="rotate-y-360 absolute backface-hidden max-h-[54vh] max-w-[850px] rounded-lg" 
                                src={`${import.meta.env.VITE_BACKEND_URL}/api/image/${cards[card].term.content}`}></img>
                            :
                            <h1 className="rotate-y-360 absolute backface-hidden text-3xl font-bold text-center align-middle pb-5">{cards[card].term.content}</h1>
                        }
                    </> 
                    <>
                        {cards[card].definition.file ? 
                            <img className="rotate-y-180 absolute backface-hidden max-h-[54vh] max-w-[850px] rounded-lg" 
                                src={`${import.meta.env.VITE_BACKEND_URL}/api/image/${cards[card].definition.content}`}></img>
                            :
                            <h1 className="rotate-y-180 absolute backface-hidden text-3xl font-bold text-center align-middle pb-5">{cards[card].definition.content}</h1>
                        }
                    </> 
                </motion.div>
            </AnimatePresence>
            <div className="flex flex-row max-w-[1000px] w-full">
                <div className="flex flex-row items-center justify-start w-1/3">
                    <button onClick={onUndo}><img className="cursor-pointer hover:opacity-[0.7] mr-10"
                        src="/undo-zinc-800.svg"></img></button>
                    <p className="mr-2">Front:</p>
                    <select className="cursor-pointer" value={front ? "Term" : "Definition"}
                        onChange={(e) => {
                            if(e.target.value === "Term") {setFront(true); setTerm(true)}
                            else {setFront(false); setTerm(false)}
                        }}>
                        <option value="Term">Term</option>
                        <option value="Definition">Definition</option>
                    </select>
                </div>
                <div className="flex flex-row items-center justify-center w-1/3 gap-10">
                    <button onClick={() => onNext(false)}><img className="h-12 bg-zinc-50 border border-zinc-200 rounded-md cursor-pointer hover:shadow"
                        src="/cross-rose-400.svg"></img></button>
                    <button onClick={() => onNext(true)}><img className="h-12 bg-zinc-50 border border-zinc-200 rounded-md cursor-pointer hover:shadow"
                        src="/tick-emerald-400.svg"></img></button>
                </div>
                <div className="flex flex-row items-center justify-end w-1/3 gap-10">
                    <button onClick={onShuffle}><img className="cursor-pointer hover:opacity-[0.7]"
                        src={(shuffled) ? "/shuffle-indigo-600.svg" : "/shuffle-zinc-800.svg"}></img></button>
                    <button onClick={onFilter}><img className="cursor-pointer hover:opacity-[0.7]"
                        src={(starred) ? "/starred-indigo-600.svg" : "/starred-zinc-800.svg"}></img></button>
                </div>
            </div>
        </section>
    );
};
export default Study;