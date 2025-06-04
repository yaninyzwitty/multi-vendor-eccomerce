"use client";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useProductFilters} from "../../hooks/use-product-filters";

export function ProductList() {
  const params = useParams();
  const trpc = useTRPC();
  const [filters] = useProductFilters();
  console.log({filters});
  const {data} = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category: params.category as string,
      ...filters,
    })
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data.docs.map((product) => (
        <div key={product.id} className="border p-4 rounded-md bg-white">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="p-2 text-gray-500">{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton() {
  return <div>Loading...</div>;
}
