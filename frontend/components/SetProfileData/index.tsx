"use client";

import { useProfileData } from "@/frontend/hooks/useProfileData";
import { useEffect } from "react";

interface SetProfileDataProps {
    email: string;
    name: string;
}

export default function SetProfileData({ email, name }: SetProfileDataProps){
    const { setEmail, setName } = useProfileData();
    
    useEffect(()=>{
        setEmail(email);
        setName(name);
    }, []);

    return null;
}