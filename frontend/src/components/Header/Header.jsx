import UserDetails from "./UserDetails";
import Sidebar from "./Sidebar";

const Header = ({user, setUser}) => {
    return (
        <header class="absolute fixed top-0 bg-white flex justify-between w-full items-center">
            <div class="flex items-center">
                <Sidebar/>
                <h1 class="text-3xl z-3 text-zinc-800" >FlashCards</h1>
            </div>
            <UserDetails user={user} setUser={setUser} />
        </header>
    );
}

export default Header;