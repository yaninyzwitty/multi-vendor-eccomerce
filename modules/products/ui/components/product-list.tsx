"use client";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

export function ProductList() {
  const params = useParams();
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.products.getMany.queryOptions({category: params.category as string})
  );
  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function ProductListSkeleton() {
  return <div>Loading...</div>;
}
