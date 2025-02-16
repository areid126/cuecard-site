import { NavLink } from 'react-router-dom'
import Logout from '../Login/Logout'

const UserDetails = ({ user, setUser }) => {
    // If the user is not logged in then return the login and register options
    if (!user) {
        return (
            <ul className="flex flex-row gap-6 mr-6" >
                <li className="hover:underline"><NavLink to="/login">Login</NavLink></li>
                <li className="hover:underline"><NavLink to="/register">Register</NavLink></li>
            </ul>
        );
    }

    // If the user is logged in then return their details
    return (
        <div className="flex flex-row gap-6 mr-6 items-center">
            <p className="hover:underline text-xl">
                <NavLink to="/account">{user.username}</NavLink>
            </p>
            <Logout setUser={setUser} />
        </div>
    );
}

export default UserDetails;