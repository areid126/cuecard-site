const Card = ({card, onStar, i}) => {
    return (
        <li class="flex flex-row bg-white p-3 w-full rounded-sm shadow text-zinc-800 gap-2">
            {card.term.file ? 
                <div class="w-[30%] flex justify-center items-center">
                    <img class="border-box rounded-sm object-scale-down max-h-96" src={card.term.content} />
                </div>
                :
                <p class="w-[30%] px-2">{card.term.content}</p>
            }
            <p class="w-1 h-full bg-zinc-50"></p>
            {card.definition.file ?
                <div class="w-[70%] flex justify-center items-center">
                    <img class="border-box object-scale-down rounded-sm max-h-96" src={card.definition.content} />
                </div>
                :
                <p class="w-[70%] px-2 text-zinc-600">{card.definition.content}</p>
            }
            <img class="h-7 cursor-pointer" src={card.starred ? "/star-amber-200.svg" : "/star-zinc-800.svg"}
                onClick={() => onStar(i)}></img>
        </li>
    );
}

const CardList = ({set, onStar}) => {
    return (
        <ul class="flex flex-col gap-3 bg-zinc-50 rounded-lg items-center w-full max-w-[1000px] p-4">
            {set.cards.map((card, i) => 
                <Card key={i} card={card} onStar={onStar} i={i}/>
            )}
        </ul>
    );
}

export default CardList;