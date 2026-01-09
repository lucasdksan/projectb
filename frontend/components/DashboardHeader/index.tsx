import Link from "next/link";
import NavigationMenuButton from "./NavigationMenuButton";
import Breadcrumb from "./Breadcrumb";

export default function DashboardHeader(){
    return(
        <header className="h-16 min-h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 z-10">
            <div className="w-auto flex items-center justify-left">
                <NavigationMenuButton />
                <Breadcrumb />
            </div>
            <div className="w-auto">
                <Link href="/dashboard/product/create" className="hidden sm:flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-dark transition-colors rounded-lg text-text-main font-bold text-sm shadow-sm shadow-primary/20">
                    <span>Novo Produto</span>
                </Link>
            </div>
        </header>
    )
}