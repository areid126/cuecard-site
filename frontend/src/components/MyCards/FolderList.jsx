import { NavLink } from "react-router-dom";

const Folder = ({folder}) => {
    return (
        <li className="text-zinc-500 bg-zinc-100 shadow rounded-sm h-16 hover:drop-shadow-sm hover:border-b-indigo-400 border-b-4 border-zinc-100">
            <NavLink to={`/my/folder/${folder.id}`} className="w-full h-full">
            <div className="flex flex-col overflow-hidden">
                <h2 className="text-zinc-800 font-bold text-2xl px-2 truncate text-ellipsis" title={folder.title}>{folder.title}</h2>
                <p className="px-2 truncate shrink-0">{`${folder.count} ${folder.count === 1 ? "set" : "sets"}`}</p>
            </div>
            </NavLink>
        </li>
    );
}

const FolderList = ({folders}) => {
    return (
        <ul className="flex flex-col gap-3">
            {folders.map((folder, i) => <Folder key={i} folder={folder} />)}
        </ul>
    );
}

export default FolderList;