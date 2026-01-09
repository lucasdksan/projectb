"use client";

import { useContext } from "react";
import { ProfileDataContext } from "../contexts/profileData/context";

export function useProfileData() {
  const context = useContext(ProfileDataContext);

  if (!context) {
    throw new Error("useProfileData must be used inside ProfileDataProvider");
  }

  return context;
}
