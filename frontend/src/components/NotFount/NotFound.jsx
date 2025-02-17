import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <section className="min-h-[87vh] m-auto flex flex-col items-center justify-center">
            <img src="/NoSearchResult.svg" className="h-96 grayscale"></img>
            <p className="text-2xl text-zinc-700 pb-9">Page does not exist</p>
            <button className="hover:opacity-[0.9] text-white bg-indigo-600 text-2xl pb-3 pt-2 px-5 rounded-xl"><NavLink to="/">Home</NavLink></button>
        </section>
    );
}

export default NotFound;