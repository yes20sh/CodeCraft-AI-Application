import React from 'react';
import { Brain } from 'lucide-react';
import { Sun } from 'lucide-react';

const Navbar = () => {
    return (
        <div className='nav flex items-center justify-between px-[50px] h-[90px] bg-zinc-800'>
            <div className="logo flex items-center gap-2">
                <Brain size={40} color='#9333ee' />
                <span className='text-2xl font-bold ml-2' >CodeCraft AI</span>
            </div>
            <div className="icon flex items-center gap-2">
                <i className='cursor-pointer transition-all hover:text-[#9333ee]'><Sun/></i>

            </div>
        </div>

    )
}

export default Navbar