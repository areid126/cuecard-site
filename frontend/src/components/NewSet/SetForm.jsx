import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import app from '../../utils/axiosConfig'

const CardDetails = ({ field, fieldName, onFieldChange, onSwitch }) => {
    // Allow the user to either upload a file or enter text for the field
    return (
        <div class="flex flex-col w-[50%] h-full justify-center">
            <div class="flex flex-row items-center m-1">
                {field.file ? 
                <><input class="bg-white outline-none border border-zinc-100 text rounded-md p-2 grow-1 text-zinc-500 cursor-pointer" 
                    onChange={onFieldChange} type="file" name="image" />
                <img class="h-10 hover:opacity-[0.7] cursor-pointer mx-4" src="/icons/text.svg" title="Upload Text" onClick={onSwitch}></img></>
                :
                <><input class="bg-white outline-none focus:border-b-indigo-600 focus:border-b-2 border border-zinc-100 rounded-md p-2 grow-1" 
                    type="text" onChange={onFieldChange} defaultValue={field.content} />
                <img class="h-10 hover:opacity-[0.7] cursor-pointer mx-4" src="/icons/image-line.svg" title="Upload Image" onClick={onSwitch}></img></>
                }
            </div>
            <label class="font-semibold uppercase text-sm text-zinc-500">{fieldName}</label>
        </div>
    )
}

// Split the general form layout into components
const CardForm = ({ card, index, onTermChange, onDefinitionChange, onRemoveCardClick, onDefSwitch, onTermSwitch }) => {
    return (
        <li class="flex h-24 bg-zinc-100 gap-4 rounded-xl border-zinc-300 items-center shadow">
            <p class="text-5xl mb-2 w-24 text-center grow-0 shrink-0 text-zinc-600">{index + 1}</p>
            <div class="flex flex-row w-full h-full">
                <CardDetails field={card.term} onFieldChange={onTermChange} fieldName={"Term"} onSwitch={onTermSwitch} />
                <CardDetails field={card.definition} onFieldChange={onDefinitionChange} fieldName={"Definition"} onSwitch={onDefSwitch} />
            </div>
            <img class="h-10 grow-0 shrink-0 w-24 hover:opacity-[0.7] cursor-pointer"
            src="/icons/delete-bin-5-line.svg" onClick={onRemoveCardClick}></img>
        </li>
    );
}

const CardList = ({ cards, onTermChange, onDefinitionChange, onRemoveCardClick, onDefSwitch, onTermSwitch }) => {
    return (
        <ul class="flex flex-col gap-4">
            {cards.map((card, i) => {
                return (
                    <CardForm key={i} index={i} card={card} onTermChange={(e) => onTermChange(e, i)} onDefinitionChange={(e) => onDefinitionChange(e, i)}
                        onRemoveCardClick={() => onRemoveCardClick(i)} onDefSwitch={() => onDefSwitch(i)} onTermSwitch={() => onTermSwitch(i)} />
                );
            })}
        </ul>
    );
}

// Function for creating cards
const SetForm = ({ set, user, formName, edit }) => {
    // Get state for the title and the description
    const [title, setTitle] = useState((set) ? set.title : "");
    const [desc, setDesc] = useState((set) ? set.description : "");
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Get state for the set's cards
    const [cards, setCards] = useState((set) ? set.cards : Array(5).fill({ term: { file: false, content: "" }, definition: { file: false, content: "" } }));


    useEffect(() => {
        setTimeout(() => {
            if (loading) setLoading(false);
            if (!loading && !user) navigate("/login")
        }, 750);
    }, [loading, user]);

    // Functions for changes to individual cards
    const onTermChange = (event, i) => {
        const newCards = [...cards];

        newCards[i] = {
            // Set the new term value
            term: {
                file: (newCards[i].term.file),
                content: (newCards[i].term.file) ? event.target.files[0] : event.target.value
            },
            // Keep the old definition content
            definition: {
                file: (newCards[i].definition.file),
                content: (newCards[i].definition.content) ? newCards[i].definition.content : ""
            }
        };

        setCards(newCards);
    }

    const onDefinitionChange = (event, i) => {
        const newCards = [...cards];

        newCards[i] = {
            // Set the new definition value
            definition: {
                file: newCards[i].definition.file,
                content: (newCards[i].definition.file) ? event.target.files[0] : event.target.value
            },
            // Keep the old term content
            term: {
                file: newCards[i].term.file,
                content: (newCards[i].term.content) ? newCards[i].term.content : ""
            }
        };

        setCards(newCards);
    }

    // Function for deleting a card
    const onRemoveCardClick = (i) => {
        const newCards = [...cards];
        newCards.splice(i, 1);
        setCards(newCards);
    }

    const onTermSwitch = (i) => {
        const newCards = [...cards];

        newCards[i] = {
            // Set the new term value
            term: {
                file: !(newCards[i].term.file),
                content: ""
            },
            // Keep the old definition content
            definition: {
                file: (newCards[i].definition.file) ? true : false,
                content: (newCards[i].definition.content) ? newCards[i].definition.content : ""
            }
        };

        setCards(newCards);
    }

    const onDefSwitch = (i) => {
        const newCards = [...cards];

        newCards[i] = {
            // Set the new definition value
            definition: {
                file: !newCards[i].definition.file,
                content: ""
            },
            // Keep the old term content
            term: {
                file: newCards[i].term.file,
                content: (newCards[i].term.content) ? newCards[i].term.content : ""
            }
        };

        setCards(newCards);
    }

    // Function for submitting the created cards
    const onSubmit = async (event) => {
        event.preventDefault();

        // Construct new set
        const newSet = { title: title, description: desc, cards: cards, public: visibility };

        // Validate the cards
        if (!newSet.title) return setError("Please Provide a Title");

        // Loop though all the cards and check they are defined
        for (let i = 0; i < cards.length; i++)
            if (!cards[i].term || !cards[i].definition || !cards[i].term.content || !cards[i].definition.content)
                return setError("Please Fill Blank Cards");

        // If the cards are all filled in and the title is set then post the cards
        try {

            // Upload all the images separately to get their id back, then use that to upload the final set
            await Promise.all(newSet.cards.map((card, i) => {
                return new Promise(async (resolve, reject) => {

                    // If the term is a file, upload the file
                    if (card.term.file) {

                        // Declare the formdata
                        const data = new FormData();
                        data.append("image", card.term.content, `card${i}_term_image`);


                        // Post the file to the file upload path
                        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/image", { method: 'POST', body: data, credentials: 'include' });

                        // Reject the promise if the upload fails
                        if (res.status !== 200) reject(res.status);
                        // If the post is successful, update the content field to be the id of the image (returned from the endpoint)
                        else newSet.cards[i].term.content = (await res.json()).id;
                    }
                    // If the definition is a file, upload the file
                    if (card.definition.file) {

                        // Declare the formdata
                        const data = new FormData();
                        data.append("image", card.definition.content, `card${i}_definition_image`);

                        // Post the file to the file upload path
                        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/image", { method: 'POST', body: data, credentials: 'include' });

                        // Reject the promise if the upload fails
                        if (res.status !== 200) reject(res.status);
                        // If the post is successful, update the content field to be the id of the image (returned from the endpoint)
                        else newSet.cards[i].definition.content = (await res.json()).id;
                    }

                    // Resolve the promise if there are no images or they were uploaded successfully
                    resolve();
                });
            }));

            // Post the set normally
            let res;
            if (edit && set) res = await app.put(`/api/set/${set.id}`, newSet);
            else res = await app.post("/api/set", newSet);

            // Process the result
            if (res) navigate(`/study/${res.data.id}`);
            else setError("Unexpected error. Please try again.");

        } catch (err) {
            setError("Unexpected error. Please try again.");
        }
    }

    const onAddCard = () => {
        // Only allow the user to have 1000 cards
        if(cards.length < 1000) 
            setCards([...cards, {term: { file: false, content: "" }, definition: { file: false, content: "" }}]);
        else setError("The maximum number of cards per set is 1000");
    }

    // If the user is not logged in redirect to the login page
    if (loading) return (
        <section class="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800">
            <img src="/bouncing-squares.svg" class="h-48 opacity-[0.2]"></img>
        </section>
    );

    return (
        <section class="min-h-[87vh] px-56 flex items-center justify-center pt-14 text-zinc-800 mx-2">
            <fieldset class="flex flex-col gap-7 w-full">
                <h2 class="text-3xl font-bold">{formName}</h2>
                <form class="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div class="flex flex-col w-full items-start bg-zinc-100 gap-1 rounded-xl p-4 shadow">
                        <label class="font-semibold uppercase text-sm text-zinc-500">Title</label>
                        <input class="bg-white outline-none focus:border-b-zinc-600 rounded-md p-2 w-full ring ring-zinc-100 border-2 border-white" 
                            type="text" placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)} value={title}></input>
                        <label class="font-semibold uppercase text-sm text-zinc-500">Description</label>
                        <input class="bg-white outline-none focus:border-b-zinc-600 rounded-md p-2 w-full ring ring-zinc-100 border-2 border-white"
                            type="text" placeholder="Enter a description" onChange={(e) => setDesc(e.target.value)} value={desc}></input>
                    </div>       
                    <CardList cards={cards} onTermChange={onTermChange} onDefinitionChange={onDefinitionChange} 
                        onRemoveCardClick={onRemoveCardClick} onTermSwitch={onTermSwitch} onDefSwitch={onDefSwitch} />
                    <div class="hover:opacity-[0.7] flex h-24 bg-zinc-100 rounded-xl shadow justify-center items-center w-full text-xl cursor-pointer"
                        onClick={onAddCard} title="Add Card">
                        <img src="/icons/add-line.svg" class="h-12"></img>
                    </div>
                    <p class="text-center font-semibold text-rose-700">{error}</p>
                    <button class="hover:opacity-[0.9] text-white bg-indigo-600 text-lg font-semibold pb-3 pt-2 px-5 rounded-xl cursor-pointer self-end"
                        onClick={onSubmit} >Save</button>
                </form>
            </fieldset>
        </section>
    );
}

export default SetForm;