import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";

interface PageProps {
  params: Promise<{slug: string}>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | null;
  }>;
}

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: PageProps) {
  const {slug} = await params;
  const {maxPrice, minPrice, tags} = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      tenantSlug: slug,
      maxPrice,
      minPrice,
      tags,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView narrowView />
    </HydrationBoundary>
  );
}
