import { NavLink } from "react-router-dom";

const Set = ({set}) => {
    return (
        <li className="text-zinc-500 bg-zinc-100 shadow hover:drop-shadow-sm rounded-sm h-16 hover:border-b-indigo-400 border-b-4 border-zinc-100">
            <NavLink to={`/my/set/${set.id}`} className="overflow-hidden w-full h-full flex flex-col">
                <div className={`flex flex-row items-center gap-2 overflow-hidden`}>
                    <h2 className="font-bold text-zinc-800 text-2xl pl-2 truncate text-ellipsis" title={set.title}>{set.title}</h2>
                    <p className="pr-2 truncate shrink-0">{`${set.count} ${set.count === 1 ? "card" : "cards"}`}</p>
                </div>
                <p className="px-2 truncate">{set.description}</p>
            </NavLink>
        </li>
    );
}

const SetList = ({sets}) => {
    return (
        <ul className="flex flex-col gap-3">
            {sets.map((set, i) => <Set key={i} set={set} />)}
        </ul>
    );
}

export default SetList;