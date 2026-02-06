import { Metadata } from "next";
import SidebarView from "@/frontend/contexts/sidebar/sidebar.view";
import ToastView from "@/frontend/contexts/toast/toast.view";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Área de controle do sistema."
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ToastView>
            <SidebarView>
                {children}
            </SidebarView>
        </ToastView>
    )
}