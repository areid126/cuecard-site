import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <footer class="flex flex-col items-center my-4">
            <div></div>
            <div class="flex flex-row items-center justify-evenly w-full">
                <div class="flex flex-row gap-7 items-end">
                    <h1 class="text-4xl" ><NavLink to="/">Flashcards</NavLink></h1>
                    <p class="text-xl">by Abbey Reid</p>
                </div>
                <div class="flex flex-row gap-5 items-end" >
                    <p class="text-xl">Find Me:</p>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/areid126" class="group h-fit w-fit rounded-full border p-1 border-slate-800 hover:opacity-75">
                        <div class="aspect-[1/1] h-8 w-8 cursor-pointer rounded-full bg-[url('/icons/global-line.svg')] bg-contain bg-center bg-no-repeat"></div>
                    </a>            
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/areid126" class="group h-fit w-fit rounded-full border p-1 border-slate-800 hover:opacity-75">
                        <div class="aspect-[1/1] h-8 w-8 cursor-pointer rounded-full bg-[url('/icons/github-line.svg')] bg-contain bg-center bg-no-repeat"></div>
                    </a>
                </div>
            </div>
            <img src="/line.png" class="w-[75%] h-5"></img>
            <p>© Copyright 2025 | All Rights Reserved</p>
        </footer>
    );
}

export default Footer;