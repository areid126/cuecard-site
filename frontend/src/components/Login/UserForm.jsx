import { NavLink } from "react-router-dom";
import Logout from "./Logout";

const UserForm = ({ handleSubmit, title, setPassword, setUsername, error, user, alt, setUser }) => {
    // If the user is already logged in prompt them to log out
    if (user) {
        return (
            <section class="min-h-[87vh] m-auto flex flex-col items-center justify-center">
                <img src="/Error.svg" class="h-96 grayscale"></img>
                <p class="text-2xl text-zinc-700 pb-9">{`Logged in as ${user.username}`}</p>
                <Logout setUser={setUser} size="text-2xl"/>
            </section>
        );
    }

    return (
        <section class="min-h-[87vh] m-auto flex items-center justify-center">
            <fieldset class="bg-zinc-50 border-zinc-300 border shadow rounded-xl p-12 flex flex-col items-center pb-8 text-zinc-800">
                <h2 class="text-4xl mb-7 font-semibold">{title}</h2>
                <form onSubmit={handleSubmit} class="flex flex-col gap-4 mb-3">
                    <div class="flex flex-col gap-1">
                        <label htmlFor="username" class="text-lg font-semibold">Username</label><br />
                        <input class="outline-none focus:ring-2 ring-offset-2 ring-indigo-600 rounded-md p-2 border bg-zinc-50 border-zinc-300 text-zinc-700 text-lg"
                            id="username" type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label htmlFor="password" class="text-lg font-semibold"> Password</label><br />
                        <input class="outline-none focus:ring-2 ring-offset-2 ring-indigo-600 rounded-md p-2 border bg-zinc-50 border-zinc-300 text-zinc-700 text-lg"
                            id="password" type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <p class="text-center font-semibold text-zinc-700">{error}</p>
                    <input value={title} type="submit" class="hover:opacity-[0.9] text-white bg-indigo-600 text-xl pb-3 pt-2 px-5 rounded-xl cursor-pointer m-auto"/>
                </form>
                <p class="hover:underline cursor-pointer"><NavLink to={`/${alt}`}>{`Or ${alt}`}</NavLink></p>
            </fieldset>
        </section>
    );
}

export default UserForm;