import {ProductListView} from "@/modules/products/ui/views/product-list-view";
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
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const {category} = await params;
  const {maxPrice, minPrice, tags} = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({category, maxPrice, minPrice, tags})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}
