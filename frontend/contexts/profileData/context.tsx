"use client";

import { createContext } from "react";

interface ProfileDataContextProps {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
}

export const ProfileDataContext = createContext<ProfileDataContextProps | null>(null);