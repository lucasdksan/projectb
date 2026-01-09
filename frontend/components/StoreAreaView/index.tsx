import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { StoreService } from "@/backend/modules/store/store.service";
import FormAddStore from "./FormAddStore";
import FormUpdateStore from "../FormUpdateStore";

export default async function StoreAreaView(){
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    const store = await StoreService.findByUserId(`${user.sub}`);

    return(
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-[#f0f4f0]">
                <span className="text-text-main text-lg font-bold">Informações da Loja</span>
                { !store && <span className="text-text-secondary text-lg">Você não possui loja cadastrada</span>}
            </div>
            { !store && <FormAddStore userId={`${user.sub}`} /> }
            { store && (
                <>
                    <FormUpdateStore email={store.email} name={store.name} number={store.number} id={`${store.id}`} />
                </>
            ) }
        </div>
    );
}