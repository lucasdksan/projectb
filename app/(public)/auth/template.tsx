export default function AuthTemplate({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="w-full max-w-md bg-[#111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
            { children }
        </div>
    );
  }