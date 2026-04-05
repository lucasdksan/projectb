import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/auth/signin");
    }
    return children;
}
