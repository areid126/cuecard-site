import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="flex flex-col items-center my-4">
            <div></div>
            <div className="flex flex-row items-center justify-evenly w-full">
                <div className="flex flex-row gap-7 items-end">
                    <h1 className="text-4xl" ><NavLink to="/">Flashcards</NavLink></h1>
                    <p className="text-xl">by Abbey Reid</p>
                </div>
                <div className="flex flex-row gap-5 items-end" >
                    <p className="text-xl">Find Me:</p>
                    <a target="_blank" rel="noopener noreferrer" href={import.meta.env.VITE_PORTFOLIO} className="group h-fit w-fit rounded-full border p-1 border-slate-800 hover:opacity-75">
                        <div className="aspect-[1/1] h-8 w-8 cursor-pointer rounded-full bg-[url('/globe-zinc-800.svg')] bg-contain bg-center bg-no-repeat"></div>
                    </a>            
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/areid126" className="group h-fit w-fit rounded-full border p-1 border-slate-800 hover:opacity-75">
                        <div className="aspect-[1/1] h-8 w-8 cursor-pointer rounded-full bg-[url('/github-zinc-800.svg')] bg-contain bg-center bg-no-repeat"></div>
                    </a>
                </div>
            </div>
            <img src="/line.png" className="w-[75%] h-5"></img>
            <p>© Copyright 2025 | All Rights Reserved</p>
        </footer>
    );
}

export default Footer;