"use client";

import {Button} from "@/components/ui/button";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useProductFilters} from "../../hooks/use-product-filters";
import ProductCard, {ProductCardSkeleton} from "./product-card";
import {InboxIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export function ProductList({narrowView}: {narrowView?: boolean}) {
  const params = useParams();
  const trpc = useTRPC();
  const [filters] = useProductFilters();
  console.log({filters});
  const {data, hasNextPage, isFetchingNextPage, fetchNextPage} =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          category:
            (params.subcategory as string) || (params.category as string),
          tenantSlug: (params.slug as string) || undefined,
          ...filters,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        }
      )
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-8 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
          narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}
      >
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => {
            console.log({image: product.tenant.image?.url});
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                imageUrl={product.image?.url}
                tenantSlug={product.tenant.slug}
                tenantImageUrl={product.tenant.image?.url}
                reviewRating={3}
                reviewCount={5}
                price={product.price}
              />
            );
          })}
      </div>
      <div className="flex pt-8 justify-center">
        {hasNextPage && (
          <Button
            className=" cursor-pointer  justify-start text-base bg-white disabled:opacity-50"
            variant={"elevated"}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </>
  );
}

export function ProductListSkeleton({narrowView}: {narrowView?: boolean}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      )}
    >
      {Array.from({length: DEFAULT_LIMIT}).map((_, INDEX) => (
        <ProductCardSkeleton key={INDEX} />
      ))}
    </div>
  );
}
