"use client";

import { useNavigationMenu } from "@/frontend/hooks/useNavigationMenu";

export default function NavigationMenuButton(){
    const { setStateMenu } = useNavigationMenu();
    
    return(
        <button onClick={()=>{
            setStateMenu(true);
        }}>
            <div className="w-6 h-6 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
        </button>
    );   
}