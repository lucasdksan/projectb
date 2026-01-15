import { redirect } from "next/navigation";
import DashboardHeader from "@/frontend/components/DashboardHeader";
import NavigationMenu from "@/frontend/components/NavigationMenu";
import { getCurrentUser } from "@/libs/auth";
import SetProfileData from "@/frontend/components/SetProfileData";

export default async function DashboardTemplate({
    children,
  }: {
    children: React.ReactNode
  }) {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    return (
      <main className="w-full h-screen lg:flex lg:flex-row">
          <NavigationMenu email={user?.email ?? ""} name={user?.name ?? ""}  />
          <SetProfileData email={user.email} name={user.name} />
          <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
            <DashboardHeader />
            <section className="flex-1 overflow-y-auto">
                { children }
            </section>
          </div>
      </main>
    );
  }
  