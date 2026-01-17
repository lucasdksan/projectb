import Link from "next/link";
import { product } from "@/backend/modules/product/product.types"

interface ProductItemProps {
  product: product;
};

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <tr className="group hover:bg-background transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{product.name}</span>
            <span className="text-slate-500 text-xs">{product.category}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-text-primary">{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col text-sm text-slate-900">
          <span>{product.createdAt.toLocaleDateString("pt-BR")}</span> 
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-right">
          <Link href={`/dashboard/product/${product.id}`} className="px-4 py-1 rounded-lg border border-slate-300 text-sm hover:border-primary hover:text-primary cursor-pointer">
            Visualizar
          </Link>
        </div>
      </td>
    </tr>
  );
}