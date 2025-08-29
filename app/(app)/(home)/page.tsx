import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
interface CategoryPageProps {
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | null;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({searchParams}: CategoryPageProps) {
  const {maxPrice, minPrice, tags} = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      maxPrice,
      minPrice,
      tags,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}
