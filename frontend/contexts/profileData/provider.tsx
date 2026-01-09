"use client";

import { useState, useMemo, useCallback } from "react";
import { ProfileDataContext } from "./context";

export function ProfileDataProvider({ children }: { children: React.ReactNode }){
    const [name, setNameState] = useState("");
    const [email, setEmailState] = useState("");
    
    const setName = useCallback((newName: string) => {
        setNameState(newName);
    }, []);

    const setEmail = useCallback((newEmail: string) => {
        setEmailState(newEmail);
    }, []);
    
    const value = useMemo(() => ({
        name,
        email,
        setEmail,
        setName,
    }), [name, email, setEmail, setName]);

    return(
        <ProfileDataContext.Provider value={value}>
            { children }
        </ProfileDataContext.Provider>
    );
}