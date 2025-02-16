import app from '../../utils/axiosConfig'
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUser, size }) => {
    const navigate = useNavigate();
    // Define event handler
    const clickLogout = () => {
        setUser(undefined); // Unset the user
        app.get("/api/auth/logout"); // Send a request to the logout end point
        navigate("/login"); // Navigate to the login page after logging out
    }

    return (
        <button title="logout" onClick={clickLogout} 
            className={`hover:opacity-[0.9] text-white bg-indigo-600 ${size} font-semibold pb-3 pt-2 px-5 rounded-xl cursor-pointer`}>
            Logout
        </button>
    );
}

export default Logout