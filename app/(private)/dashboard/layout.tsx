import { NavigationMenuProvider } from "@/frontend/contexts/navigationMenu/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Área principal",
    description: ""
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <NavigationMenuProvider>
            {children}
        </NavigationMenuProvider>
    )
}