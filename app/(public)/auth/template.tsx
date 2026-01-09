export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full px-4 py-12">
        <div className="w-full max-w-[480px] bg-surface rounded-xl shadow-xl border border-[#f0f4f0] overflow-hidden">
            { children }
        </div>
    </div>
  );
}
