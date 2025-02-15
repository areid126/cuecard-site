import app from '../../utils/axiosConfig'


const Logout = ({ setUser, size }) => {
    // Define event handler
    const clickLogout = () => {
        setUser(undefined); // Unset the user
        app.get("/api/auth/logout"); // Send a request to the logout end point
    }

    return (
        <button title="logout" onClick={clickLogout} 
            class={`hover:opacity-[0.9] text-white bg-indigo-600 ${size} font-semibold pb-3 pt-2 px-5 rounded-xl cursor-pointer`}>
            Logout
        </button>
    );
}

export default Logout