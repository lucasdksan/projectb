"use client";

import { useContext } from "react";
import { NavigationMenuContext } from "../contexts/navigationMenu/context";

export function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);

  if (!context) {
    throw new Error("useProfileData must be used inside ProfileDataProvider");
  }

  return context;
}
