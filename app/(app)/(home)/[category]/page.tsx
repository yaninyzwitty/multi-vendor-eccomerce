import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
interface CategoryPageProps {
  params: Promise<{category: string}>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | null;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const {category} = await params;
  const {maxPrice, minPrice, tags} = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category,
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
