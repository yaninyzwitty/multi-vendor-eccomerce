"use client";
import {StarRating} from "@/components/star-rating";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {formatCurrency, generateTenantUrl} from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {LinkIcon, StarIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Fragment} from "react";

interface ProductViewProps {
  tenantSlug: string;
  productId: string;
}

// TODO-aDD REAL ratings

export function ProductView({productId, tenantSlug}: ProductViewProps) {
  const trpc = useTRPC();
  const {data: product} = useSuspenseQuery(
    trpc.products.getOne.queryOptions({id: productId})
  );

  console.log({tenant: product.tenant});

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={product.image?.url ?? `/product-fallback.png`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{product.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 bg-pink-400 w-fit">
                  <p className="font-medium text-base">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={`${generateTenantUrl(tenantSlug)}`}
                  className="flex items-center gap-2"
                >
                  {product.tenant?.image?.url && (
                    <Image
                      src={product.tenant.image?.url ?? `/product-fallback.png`}
                      alt={product.tenant.name}
                      width={16}
                      height={16}
                      className="rounded-full border object-cover shrink-0 size-[16px]"
                    />
                  )}
                  <p className="text-base font-medium underline">
                    {product.tenant?.name}
                  </p>
                </Link>
              </div>

              {/* rating */}
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <StarRating rating={3} iconClassName="size-4" />
                </div>
              </div>
            </div>
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-1">
                <StarRating rating={3} iconClassName="size-4" />
                <p className="text-base font-medium">{5} ratings</p>
              </div>
            </div>
            <div className="p-6">
              {product.description ? (
                <p className="text-base font-medium">{product.description}</p>
              ) : (
                <p className="text-muted-foreground italic font-medium">
                  No description available
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className=" border-t lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <Button variant={"elevated"} className="flex-1 bg-pink-500">
                    Add to Cart
                  </Button>
                  <Button
                    className="size-12 "
                    variant={"elevated"}
                    disabled={false}
                    onClick={() => {}}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {product.refundPolicy == "no-refund"
                    ? "No refunds"
                    : `${product.refundPolicy} money back guarantee`}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>{5}</p>
                    <p className="text-base">({5}) ratings</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress value={25} className="h-[1lh]" />
                      <div className="font-medium">{25}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
