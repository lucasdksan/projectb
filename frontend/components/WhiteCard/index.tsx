interface WhiteCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function WhiteCard({ children, ...props }: WhiteCardProps) {
    return (
        <div className="bg-surface w-full rounded-xl border border-gray-100 p-5 shadow-sm group" {...props}>
            {children}
        </div>
    );
}