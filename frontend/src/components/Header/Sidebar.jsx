import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Animation for text in the buttons
const animateText = {
    initial : {
        opacity: 0
    },
    animate :{
        opacity: 1,
        transition: {
            delay: 0.1,
            duration: 0
        },
    },
    exit :{
        opacity: 0,
        transition: {
            duration: 0,
        },
    }
}

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const animateButtons = {
        initial : {
            width: 52,
        },
        animate :{
            width: open ? "auto" : 52,
            transition: {
                duration: 0.2,
            },
        },
        exit :{
            width: 52,
            transition: {
                duration: 0.2,
            },
        }
    }

    return (
        <>  
            <button onClick={() => setOpen(!open)} class="w-7 m-5 ml-5 z-2 cursor-pointer">
                <img src="/menu-zinc-800.svg"></img>
            </button>
            <AnimatePresence mode="wait" initial={false}>
                <nav class="absolute top-0 left-0 flex flex-col items-start opacity-100 z-1">
                    <ul class="flex flex-col w-56 mt-18">
                        <li class="ml-2 list-none m-1">
                            <NavLink to="/" className={({isActive}) => isActive ? "*:bg-fuchsia-50 *:text-fuchsia-700 *:ring" : ""}>
                                <motion.div key={open ? "minus" : "plus"} {...animateButtons} 
                                class={`flex flex-row items-center bg-white hover:bg-fuchsia-50 hover:text-fuchsia-700 hover:ring rounded-xl`}>
                                    <img src="/home-zinc-800.svg" class="w-7 m-3 shrink-0" ></img>
                                    {open && <motion.p {...animateText}  class="text-lg pr-5 text-nowrap">Home</motion.p>}
                                </motion.div>
                            </NavLink>
                        </li>
                        <li class="ml-2 list-none m-1">
                            <NavLink to="/my" className={({isActive}) => isActive ? "*:bg-emerald-50 *:text-emerald-700 *:ring" : ""}>
                                <motion.div key={open ? "minus" : "plus"} {...animateButtons} class="flex flex-row items-center bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:ring rounded-xl w-fit">
                                    <img src="/folder-zinc-800.svg" class="w-7 m-3 shrink-0" ></img>
                                    {open && <motion.p {...animateText} class="text-lg pr-5 text-nowrap">My Sets</motion.p>}
                                </motion.div>
                            </NavLink>
                        </li>
                        <li class="ml-2 list-none m-1">
                            <NavLink to="/new" className={({isActive}) => isActive ? "*:bg-cyan-50 *:text-cyan-700 *:ring" : ""}>
                                <motion.div key={open ? "minus" : "plus"} {...animateButtons} class="flex flex-row items-center bg-white hover:bg-cyan-50 hover:text-cyan-700 hover:ring rounded-xl">
                                    <img src="/plus-zinc-800.svg" class="w-7 m-3 shrink-0" ></img>
                                    {open && <motion.p {...animateText} class="text-lg pr-5 text-nowrap">New Set</motion.p>}
                                </motion.div>
                            </NavLink>   
                        </li>
                        <li class="ml-2 list-none m-1">
                            <NavLink to="/account" className={({isActive}) => isActive ? "*:bg-orange-50 *:text-orange-700 *:ring" : ""}>
                                <motion.div key={open ? "minus" : "plus"} {...animateButtons} class="flex flex-row items-center bg-white hover:bg-orange-50 hover:text-orange-700 hover:ring rounded-xl">
                                    <img src="/account-zinc-800.svg" class="w-7 m-3 shrink-0" ></img>
                                    {open && <motion.p {...animateText} class="text-lg pr-5 text-nowrap">Account</motion.p>}
                                </motion.div>
                            </NavLink>   
                        </li>
                    </ul>
                </nav>
            </AnimatePresence>
        </>
    );
}

export default Sidebar;