const Card = ({card, onStar, i}) => {
    return (
        <li className="flex flex-row bg-white p-3 w-full rounded-sm shadow text-zinc-800 gap-2">
            {card.term.file ? 
                <div className="w-[30%] flex justify-center items-center">
                    <img className="border-box rounded-sm object-scale-down max-h-96" 
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/image/${card.term.content}`} />
                </div>
                :
                <p className="w-[30%] px-2">{card.term.content}</p>
            }
            <p className="w-1 h-full bg-zinc-50"></p>
            {card.definition.file ?
                <div className="w-[70%] flex justify-center items-center">
                    <img className="border-box object-scale-down rounded-sm max-h-96" 
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/image/${card.definition.content}`} />
                </div>
                :
                <p className="w-[70%] px-2 text-zinc-600">{card.definition.content}</p>
            }
            <img className="h-7 cursor-pointer" src={card.starred ? "/star-amber-200.svg" : "/star-zinc-800.svg"}
                onClick={() => onStar(i)}></img>
        </li>
    );
}

const CardList = ({set, onStar}) => {
    return (
        <ul className="flex flex-col gap-3 bg-zinc-50 rounded-lg items-center w-full max-w-[1000px] p-4">
            {set.cards.map((card, i) => 
                <Card key={i} card={card} onStar={onStar} i={i}/>
            )}
        </ul>
    );
}

export default CardList;