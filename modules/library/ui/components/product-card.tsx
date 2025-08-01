interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

import {StarIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  tenantSlug,
  id,
  name,
  reviewCount,
  reviewRating,
  price,
  tenantImageUrl,

  imageUrl,
}: ProductCardProps) {
  console.log({reviewCount, reviewRating});
  return (
    <Link href={`/library/${id}`}>
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden flex flex-col h-full">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/product-fallback.png"}
            className="object-cover"
          />
        </div>
        <div className="p-4 border-y flex flex-col gap-3 flex-1 justify-between">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
          <div className="flex items-center gap-2">
            {tenantImageUrl && (
              <Image
                src={tenantImageUrl}
                alt={tenantSlug}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px]"
              />
            )}
            <p className="text-sm underline font-medium">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
          <div className="relative py-1 px-2 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(price))}
            </p>
          </div>
        </div>{" "}
      </div>
    </Link>
  );
}

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-[3/4] bg-neutral-200 rounded-lg animate-pulse" />
  );
};
