import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CardStoreModel } from "./cardstore.model";
import { formatCardStoreDisplay } from "./cardstore.viewmodel";

interface CardStoreViewProps extends CardStoreModel {
    slug?: string;
}

export default function CardStoreView(props: CardStoreViewProps) {
    const display = formatCardStoreDisplay(props);
    const { slug } = props;

    const content = (
        <>
            <div className="relative w-full max-w-sm -mt-16 bg-white rounded-3xl shadow-lg">
                <div className="flex justify-center -mt-12 mb-4">
                    <div
                        className="relative w-24 h-24 rounded-full border-2 overflow-hidden shadow-md"
                        style={{ borderColor: display.primaryColor }}
                    >
                        {display.image ? (
                            <img
                                src={display.image}
                                alt={display.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                                style={{ backgroundColor: display.primaryColor }}
                            >
                                {display.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-5 pb-6 pt-2 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-xl font-bold text-black truncate flex-1">
                            {display.name}
                        </h1>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>

                    {display.description && (
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-gray-500 flex-1 line-clamp-2">
                                {display.description}
                            </p>
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                    )}

                    {display.contactLine && (
                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 break-all">
                                        {display.contactLine}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="relative min-h-[400px] pt-4 w-full flex flex-col items-center">
            {slug ? (
                <Link href={`/store/${slug}`} className="w-full flex flex-col items-center max-w-sm px-4">
                    {content}
                </Link>
            ) : (
                <div className="w-full flex flex-col items-center max-w-sm px-4">
                    {content}
                </div>
            )}
        </div>
    );
}
