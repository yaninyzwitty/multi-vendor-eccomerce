import {cn, formatCurrency} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutItemProps {
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}
export function CheckoutItem({
  isLast,
  imageUrl,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  price,
  onRemove,
}: CheckoutItemProps) {
  return (
    <div
      className={cn(
        `grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b`,
        isLast && "border-b-0"
      )}
    >
      <div className="overflow-hidden border-r bg-rose-500 ">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/product-fallback.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex py-4 flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <h4 className="font-medium underline">{tenantName}</h4>
          </Link>
        </div>
      </div>
      <div className="flex py-4 flex-col justify-between">
        <p className="font-medium">{formatCurrency(price)}</p>
        <button
          className="underline font-medium cursor-pointer"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
