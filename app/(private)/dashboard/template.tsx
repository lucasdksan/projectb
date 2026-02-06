import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import MenuView from "@/frontend/components/Menu/menu.view";

export default async function DashboardTemplate({
    children,
  }: {
    children: React.ReactNode
  }) {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    return (
        <div className="flex min-h-screen max-h-screen overflow-hidden">
            <MenuView email={user.email} name={user.name} />
            <main className="flex-1 p-12 overflow-y-auto">
                {children}
            </main>
      </div>
    );
  }
  