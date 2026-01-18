type FormSearchProps = React.FormHTMLAttributes<HTMLFormElement> & {
    search: string;
    setSearch: (search: string) => void;
};

export default function FormSearch({ search, setSearch, ...props }: FormSearchProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form {...props}>
                <input type="text" className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-background text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" className="px-4 py-1 rounded-lg border border-slate-300 text-sm hover:border-primary hover:text-primary cursor-pointer">Pesquisar</button>
            </form>
        </div>
    );
}